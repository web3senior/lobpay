/**
 * @file hooks/useUniswapSwap.js
 * @description Custom hook to interface with the Uniswap Trade API using Wagmi.
 */

import { useSendTransaction, useSignTypedData, useAccount } from 'wagmi'

export const useUniswapSwap = () => {
  const { address } = useAccount()
  const { sendTransactionAsync } = useSendTransaction()
  const { signTypedDataAsync } = useSignTypedData()

  /**
   * API configuration for Uniswap Gateway
   */
  const API_URL = 'https://trade-api.gateway.uniswap.org/v1'
  const headers = {
    'x-api-key': process.env.NEXT_PUBLIC_UNISWAP_API_KEY,
    accept: 'application/json',
    'content-type': 'application/json',
  }

  /**
   * Helper to handle BigInt serialization in JSON.stringify
   */
  const jsonReplacer = (key, value) =>
    typeof value === 'bigint' ? value.toString() : value

  /**
   * Main swap handler coordinating approval, quotes, and execution
   */
  const handleSwap = async (tokenIn, tokenOut, amount, chainId = 1) => {
    // Keep amount as a string for API calls, convert to BigInt only for transactions
    const amountStr = amount.toString()
    
    try {
      /**
       * Check if the protocol requires an ERC20 approval transaction
       */
      const approvalRes = await fetch(`${API_URL}/check_approval`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          walletAddress: address,
          amount: amountStr, // Send as string
          token: tokenIn,
          chainId,
        }, jsonReplacer),
      })

      const approvalData = await approvalRes.json()

      if (approvalData.approval) {
        /**
         * Execute approval transaction via Wagmi if necessary
         */
        await sendTransactionAsync({
          to: approvalData.approval.to,
          data: approvalData.approval.data,
          value: BigInt(approvalData.approval.value || 0),
        })
      }

      /**
       * Request a swap quote from the Uniswap routing engine
       */
      const quoteRes = await fetch(`${API_URL}/quote`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          swapper: address,
          tokenInChainId: chainId,
          tokenOutChainId: chainId,
          tokenIn,
          tokenOut,
          amount: amountStr, // Send as string
          type: 'EXACT_INPUT',
        }, jsonReplacer),
      })

      if (!quoteRes.ok) {
        const errorDetail = await quoteRes.json()
        throw new Error(errorDetail.message || 'Failed to fetch quote')
      }

      const { quote, permitData, routing } = await quoteRes.json()

      /**
       * Handle EIP-712 permit signatures
       */
      let signature
      if (permitData) {
        signature = await signTypedDataAsync({
          domain: permitData.domain,
          types: permitData.types,
          primaryType: 'Permit',
          message: permitData.values,
        })
      }

      /**
       * Execute standard on-chain swaps
       */
      if (['CLASSIC', 'WRAP', 'UNWRAP', 'BRIDGE'].includes(routing)) {
        const requestBody = {
          signature,
          quote,
        }

        if (permitData && typeof permitData === 'object') {
          requestBody.permitData = permitData
        }

        const swapRes = await fetch(`${API_URL}/swap`, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody, jsonReplacer),
        })

        const swapData = await swapRes.json()

        if (!swapData || !swapData.swap) {
          console.error('[LobPay_Internal_API_Response]:', swapData)
          throw new Error(swapData.message || 'Swap object missing from response')
        }

        await sendTransactionAsync({
          to: swapData.swap.to,
          data: swapData.swap.data,
          value: BigInt(swapData.swap.value || 0),
        })
      } else {
        /**
         * Submit offline order for Dutch Auctions (UniswapX)
         */
        const orderRes = await fetch(`${API_URL}/order`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ signature, quote }, jsonReplacer),
        })

        if (!orderRes.ok) {
          const orderError = await orderRes.json()
          throw new Error(orderError.message || 'Failed to submit Dutch Order')
        }
      }

      return { success: true }
    } catch (error) {
      console.error('[LobPay_Swap_Error]:', error)
      throw error
    }
  }

  return { handleSwap }
}