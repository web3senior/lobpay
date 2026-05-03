/**
 * x402 Library - ETH Payment Test Utility
 * Sends native ETH and logs the transaction hash for the x402 header.
 */

require('dotenv').config()
const { ethers } = require('ethers')

async function signAndSendETH() {
  try {
    console.log(process.env.PRIVATE_KEY)
    // Logic: Initialize provider and wallet from env
    const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

    const destination = process.env.DESTINATION_ADDRESS
    const amount = ethers.parseEther(process.env.ETH_AMOUNT || '0.0001')

    console.log('--- Initiating ETH x402 Payment ---')
    console.log(`Wallet: ${wallet.address}`)
    console.log(`Target: ${destination}`)
    console.log(`Value:  ${process.env.ETH_AMOUNT} ETH`)

    // Logic: Create and send the transaction
    const tx = await wallet.sendTransaction({
      to: destination,
      value: amount,
    })

    console.log('\n--- TRANSACTION SENT ---')
    console.log(`Hash: ${tx.hash}`)

    // Logic: Wait for the network to mine the block
    console.log('Waiting for network confirmation...')
    await tx.wait()

    console.log('\n--- HEADER FOR YOUR API REQUEST ---')
    console.log(
      JSON.stringify(
        {
          'x402-payment-signature': tx.hash,
        },
        null,
        4,
      ),
    )
  } catch (error) {
    console.error('Payment failed:', error.message)
  }
}

signAndSendETH()
