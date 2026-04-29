/**
 * x402 Library - LSP7 Signing Test
 */
const { ethers } = require('ethers')

async function generateLSP7Signature() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY)

  const domain = {
    name: 'X402_LSP7_PAYMENT',
    version: '1',
    chainId: 4201, // LUKSO Testnet
    verifyingContract: '0x545fa9e6dac233691d97b00d9f66be5676f274f1',
  }

  const types = {
    PaymentAuthorization: [
      { name: 'agent', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'nonce', type: 'bytes32' },
    ],
  }

  const message = {
    agent: wallet.address,
    recipient: '0xf02aC40cc8122fdEf44D555D2E071C06d5bdD0BF',
    amount: ethers.parseUnits('1.0', 18),
    nonce: ethers.hexlify(ethers.randomBytes(32)),
  }

  const signature = await wallet.signTypedData(domain, types, message)

  console.log('Header Value:', signature)
  console.log(`message:`)
  console.log(message)
  return { message, signature }
}

require('dotenv').config()
generateLSP7Signature()
