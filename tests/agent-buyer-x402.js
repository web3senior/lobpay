/**
 * @file tests/agent-buyer-x402.js
 * @description Final debugged version for @x402/fetch v2.
 */

import { x402Client, wrapFetchWithPayment } from '@x402/fetch'
import { registerExactEvmScheme } from '@x402/evm/exact/client'
import { privateKeyToAccount } from 'viem/accounts'
import { getAddress } from 'viem'

// Base URL of the API
const BASE_URL = `http://localhost:3000`

// API key
const API_KEY = `ak_live_b2f83532d711bec4aaf38ff13cff9bfcf589d585c4e7d330`

// Agent private key
const privateKey = process.env.PRIVATE_KEY

// 1. Manually validate the address locally first
const account = privateKeyToAccount(privateKey)
const agentAddress = getAddress(account.address) // Force checksum

if (!agentAddress) {
  throw new Error('CRITICAL: Private key did not resolve to a valid address.')
}

// 2. Initialize Client using the "blessed" registration helper
const client = new x402Client()
registerExactEvmScheme(client, { signer: account })

// 3. Wrap fetch
const fetchWithPayment = wrapFetchWithPayment(fetch, client)

async function runTest() {
  console.log('--- Initiating Autonomous Purchase ---')
  console.log(`Agent Wallet: ${agentAddress}`)
  console.log(`Network: eip155:84532 (Base Sepolia)`)

  try {
    const response = await fetchWithPayment(`${BASE_URL}/api/v1/agents/purchase`, {
      method: 'POST',
      body: JSON.stringify({
        items: [{ product_id: 1, quantity: 1 }],
      }),
      headers: {
        'Content-Type': 'application/BASE_URL=``n',
        Authorization: `Bearer ${API_KEY}`,
      },
    })

    const body = await response.json()
    console.log('✅ Server Response:', body)
  } catch (error) {
    // This part is crucial for debugging
    console.error('❌ Error during execution:', error.message)

    if (error.message.includes('Address "null" is invalid')) {
      console.warn("\n💡 DEBUG TIP: The client is receiving a 402 challenge, but the 'payTo' field in the server's response header is likely empty or malformed.")
      console.warn('Check your server-side middleware for: payTo: destinationAddress')
    }
  }
}

runTest()
