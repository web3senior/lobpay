/* Importing dependencies using CommonJS syntax */
/* Importing dependencies using CommonJS syntax */
require('dotenv').config(); // <--- ADD THIS LINE
const { verifyTypedData } = require('viem');
const { luksoTestnet } = require('viem/chains');
const { ethers } = require('ethers');

// ... rest of your code

/**
 * Validates the LSP7 signature and ensures the agent is legit.
 * Uses EIP-712 typed data verification.
 */
async function processLSP7Payment(signature, message, tokenAddress) {
  /* Define the EIP-712 domain and types */
  const domain = {
    name: 'X402_LSP7_PAYMENT',
    version: '1',
    chainId: 4201, // LUKSO Testnet
    verifyingContract:tokenAddress,
  }

  const types = {
    PaymentAuthorization: [
      { name: 'agent', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'nonce', type: 'bytes32' },
    ],
  }

  try {
    /* Perform the cryptographic verification */
    const isValid = await verifyTypedData({
      address: message.agent,
      domain,
      types,
      primaryType: 'PaymentAuthorization',
      message,
      signature,
    })

    if (!isValid) {
      console.error('Verification failed: Invalid Signature')
      return { success: false, error: 'Invalid Signature' }
    }

   const payment = await executeLSP7Payment({message, signature})

    console.log('Verification successful for agent:', message.agent)
    return { success: true, agent: message.agent, payment }
  } catch (error) {
    console.error('Verification error:', error.message)
    return { success: false, error: error.message }
  }
}



/**
 * x402 Library - LSP7 Execution Test
 * Sends the actual transaction to the blockchain using the signed data.
 */
// The ABI for your LSP7 contract (specifically the transfer function)
const LSP7_ABI = [
  "function transfer(address from, address to, uint256 amount, bool force, bytes data) returns (bool)"
];

async function executeLSP7Payment(signedData) {
  const provider = new ethers.JsonRpcProvider("https://rpc.testnet.lukso.network");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const lsp7Contract = new ethers.Contract(
    `0x545fa9e6dac233691d97b00d9f66be5676f274f1`,
    LSP7_ABI,
    wallet
  );

  const { message, signature } = signedData;

  console.log("--- Executing LSP7 Transfer on Testnet ---");

  try {
    // Logic: Execute the transfer
    // In a 'Self-Settle' flow, the agent sends this. 
    // In a 'Relay' flow, the signature is passed to a service that pays the gas.
    const tx = await lsp7Contract.transfer(
      message.agent,
      message.recipient,
      message.amount,
      false, // force: false is safer
      signature // We pass the signature in the 'data' field for traceability
    );

    console.log(`Transaction Sent! Hash: ${tx.hash}`);
    
    // Logic: Wait for the blockchain to confirm
    const receipt = await tx.wait();
    console.log("Payment Confirmed in block:", receipt.blockNumber);

    return tx.hash;
  } catch (error) {
    console.error("Execution failed:", error.message);
  }
}











/* Execute the logic */
const testSignature =
  '0xcc42cd345d77a819dcf49cf99df675d9958ecc7d74ee4253acc21de10cb14f95167c4eb76a79a699255149a9f897a89ea1d79ea9dad14157b31569e0eb0870a71b'
const testMessage = {
  agent: '0xeeD4C09Ec4fd49676cAcA7847cD5fBf3615DA4D4',
  recipient: '0xf02aC40cc8122fdEf44D555D2E071C06d5bdD0BF',
  amount: ethers.parseUnits('1.0', 18),
  nonce: '0x5928826c77d9c96b302bfe64ad73fd26fe631dd385173bfb0b25a91d18f6b819'
}
const tokenAddr = '0x545fa9e6dac233691d97b00d9f66be5676f274f1'

processLSP7Payment(testSignature, testMessage, tokenAddr)






/* Exporting the function for use in other CommonJS files */
module.exports = {
  processLSP7Payment,
}
