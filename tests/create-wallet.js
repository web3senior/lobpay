/**
 * x402 Library - Wallet Generation Test
 * Generates a full wallet object and logs it directly to the terminal.
 * Sample:
 */

const { ethers } = require('ethers')

async function generateWallet() {
  // Logic: Log immediately to confirm the script is running
  console.log('Initializing Wallet Generation...')

  try {
    // Logic: Use the Wallet constructor for a fresh random instance
    const wallet = ethers.Wallet.createRandom()

    // Element: Construct a clean object for the response
    const credentials = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey,
      mnemonic: wallet.mnemonic.phrase,
    }

    // Logic: Output the results formatted with 4-space indentation
    console.log('\n--- CREDENTIALS START ---')
    console.log(JSON.stringify(credentials, null, 4))
    console.log('--- CREDENTIALS END ---\n')

    return credentials
  } catch (error) {
    // Logic: Catch common issues like missing entropy in certain environments
    console.error('Critical Error: Wallet could not be generated.', error.message)
  }
}

// Logic: Call the function and handle the promise
generateWallet().then(() => {
  console.log('Process complete.')
})
