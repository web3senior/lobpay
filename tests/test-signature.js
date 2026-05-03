/**
 * @file tests/test-signature.js
 * @description ESM-compatible signature utility for lobx agents.
 */

import { ethers } from 'ethers'

// ■■■ Configuration ■■■
// Use environment variables or hardcoded values for testing
const PRIVATE_KEY = '0x4083026c087523ea5fe156f3ec9351838041574de0547f5da150a6d1c80d246a'
const NONCE = 'f8cd9acced8714f0808961507920533b'
const APP_NAME = 'LobPay' // Matches your new brand name

async function signChallenge() {
  try {
    const wallet = new ethers.Wallet(PRIVATE_KEY)

    /**
     * The message construction must match your API route exactly.
     * We use a fallback for APP_NAME if process.env isn't loaded in this raw script.
     */
    const message = `${APP_NAME} Agent Login Challenge: ${NONCE}`

    console.log(`--- ${APP_NAME.toUpperCase()} Agent Signer ---`)
    console.log(`Wallet Address: ${wallet.address}`)
    console.log(`Signing Message: "${message}"`)

    /**
     * signMessage prepends the EIP-191 prefix automatically.
     */
    const signature = await wallet.signMessage(message)

    console.log('\n--- JSON PAYLOAD FOR /api/v1/agents/auth/register ---')
    console.log(
      JSON.stringify(
        {
          address: wallet.address,
          nonce: NONCE,
          signature: signature,
          agentName: 'Atla_Test_Node',
          erc8004Address: '0x0000000000000000000000000000000000000000', // Optional
        },
        null,
        4,
      ),
    )
  } catch (error) {
    console.error('Signing failed:', error)
  }
}

signChallenge()
