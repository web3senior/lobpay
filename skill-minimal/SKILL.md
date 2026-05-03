---
name: lobpay-minimal
description: LobPay X402 Commerce - Purchase items via X402 protocol on Base network. Use when agents need to buy products, checkout, pay merchants, or leave feedback. Keywords: "Buy", "Purchase", "Pay", "Checkout", "X402", "Rate merchant", "Leave feedback". Handles checkout info retrieval, X402 payment initiation, transaction recording, and merchant ratings on Base Sepolia/Mainnet.
---

# 🦞 LobPay Minimal

AI-powered commerce via X402 protocol on Base network.

**API Base:** `http://localhost:3000/api/v1` (dev) or `https://lobpay.market/api/v1` (prod)  
**Network:** Base Sepolia (eip155:84532)  
**Protocol:** X402 Payment

---

## 🚀 Quick Start

### 1. Register Agent

```javascript
// register.js
import { privateKeyToAccount } from 'viem/accounts'
import { getAddress } from 'viem'
import fs from 'fs'
import path from 'path'
import os from 'os'

const CONFIG_DIR = path.join(os.homedir(), '.lobpay')
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json')

const [agentName, address, privateKey, apiKey] = process.argv.slice(2)
const account = privateKeyToAccount(privateKey)
const agentAddress = getAddress(account.address)

if (!fs.existsSync(CONFIG_DIR)) fs.mkdirSync(CONFIG_DIR, { recursive: true })

fs.writeFileSync(CONFIG_FILE, JSON.stringify({
  agentName, address: agentAddress.toLowerCase(), privateKey, apiKey,
  registeredAt: new Date().toISOString()
}, null, 2))

console.log('✅ Registered:', agentName)
```

Usage:
```bash
node register.js "MyAgent" 0xAddress 0xPrivateKey api_key
```

---

### 2. Checkout (Get Pricing)

```javascript
// checkout.js
import axios from 'axios'

const API_BASE = process.env.LOBPAY_API_URL || 'http://localhost:3000'
const [productId, quantity = 1] = process.argv.slice(2)

const res = await axios.get(`${API_BASE}/api/v1/public/checkout-info`, {
  params: { product_id: productId, quantity }
})

console.log('Product:', res.data.product_name)
console.log('Total:', res.data.total_amount, res.data.currency)
console.log('Merchant:', res.data.merchant_wallet)
```

---

### 3. Purchase (X402 Payment)

```javascript
// purchase.js
import { x402Client, wrapFetchWithPayment } from '@x402/fetch'
import { registerExactEvmScheme } from '@x402/evm/exact/client'
import { privateKeyToAccount } from 'viem/accounts'
import fs from 'fs'
import path from 'path'
import os from 'os'

const API_BASE = process.env.LOBPAY_API_URL || 'http://localhost:3000'
const CONFIG = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.lobpay/config.json')))
const [productId, quantity = 1] = process.argv.slice(2)

const account = privateKeyToAccount(CONFIG.privateKey)
const client = new x402Client()
registerExactEvmScheme(client, { signer: account })
const fetchWithPayment = wrapFetchWithPayment(fetch, client)

const res = await fetchWithPayment(`${API_BASE}/api/v1/agents/purchase`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${CONFIG.apiKey}`
  },
  body: JSON.stringify({ items: [{ product_id: parseInt(productId), quantity: parseInt(quantity) }] })
})

const data = await res.json()
console.log('✅ Transaction:', data.transaction_id)
console.log('Hash:', data.recorded_hash)
```

---

### 4. Quick Buy (Combined)

```javascript
// buy.js - Complete flow
import { x402Client, wrapFetchWithPayment } from '@x402/fetch'
import { registerExactEvmScheme } from '@x402/evm/exact/client'
import { privateKeyToAccount } from 'viem/accounts'
import fs from 'fs'
import path from 'path'
import os from 'os'

const API_BASE = (process.env.LOBPAY_API_URL || 'http://localhost:3000').replace(/\s+/g, '')
const CONFIG = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.lobpay/config.json')))
const [productId, quantity = 1] = process.argv.slice(2).map(Number)

const account = privateKeyToAccount(CONFIG.privateKey)
const client = new x402Client()
registerExactEvmScheme(client, { signer: account })
const fetchWithPayment = wrapFetchWithPayment(fetch, client)

// 1. Checkout
const checkoutRes = await fetch(`${API_BASE}/api/v1/public/checkout-info?product_id=${productId}&quantity=${quantity}`)
const checkout = await checkoutRes.json()
console.log(`💰 ${checkout.product_name}: ${checkout.total_amount}`)

// 2. Purchase with X402
const purchaseRes = await fetchWithPayment(`${API_BASE}/api/v1/agents/purchase`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${CONFIG.apiKey}`
  },
  body: JSON.stringify({ items: [{ product_id: productId, quantity }] })
})

const result = await purchaseRes.json()
console.log('✅ Transaction ID:', result.transaction_id)
console.log('Hash:', result.recorded_hash)
```

---

### 5. Leave Feedback

```javascript
// feedback.js
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import os from 'os'

const API_BASE = process.env.LOBPAY_API_URL || 'http://localhost:3000'
const CONFIG = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.lobpay/config.json')))

const args = process.argv.slice(2)
let transactionId, rating, comment

if (args.length === 2) {
  // Rate last purchase
  const history = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.lobpay/history.json')))
  transactionId = history[0].transaction_id
  rating = parseInt(args[0])
  comment = args[1]
} else {
  transactionId = parseInt(args[0])
  rating = parseInt(args[1])
  comment = args[2]
}

const res = await axios.post(`${API_BASE}/api/v1/agents/feedback`, {
  transaction_id: transactionId,
  rating,
  comment,
  status: 'confirmed'
}, {
  headers: { 'Authorization': `Bearer ${CONFIG.apiKey}` }
})

console.log('✅ Feedback submitted for transaction', transactionId)
```

---

## 📋 API Endpoints

### Public

**GET** `/api/v1/public/checkout-info?product_id={id}&quantity={qty}`

Response:
```json
{
  "product_name": "Premium Widget",
  "unit_price": "10.00",
  "total_amount": "20.00",
  "currency": "USD",
  "merchant_wallet": "0x1234...",
  "merchant_name": "Acme Corp",
  "network": "eip155:84532"
}
```

### Authenticated (Requires API Key)

**POST** `/api/v1/agents/purchase`

Headers: `Authorization: Bearer {api_key}`

Body:
```json
{
  "items": [
    { "product_id": 101, "quantity": 2 }
  ]
}
```

Response:
```json
{
  "success": true,
  "transaction_id": 123,
  "recorded_hash": "0xabc...",
  "total_amount": "20.00",
  "message": "Transaction recorded"
}
```

**POST** `/api/v1/agents/feedback`

Body:
```json
{
  "transaction_id": 123,
  "rating": 5,
  "comment": "Great service!",
  "status": "confirmed"
}
```

---

## 💰 X402 Payment Flow

1. **Request** resource with API key
2. **Server** returns `402 Payment Required` with headers:
   - `X-Payment-Version: x402-1.0`
   - `X-Payment-Chain: eip155:84532`
   - `X-Payment-Amount: 2000000`
   - `X-Payment-Token: 0x...`
   - `X-Payment-Pay-To: 0xMerchantWallet`
3. **Client** signs payment header with private key
4. **Client** resends with `X-Payment` header
5. **Server** settles on-chain and records transaction

---

## 🛠️ Setup

```bash
# 1. Create project
mkdir lobpay-agent && cd lobpay-agent
npm init -y

# 2. Install dependencies
npm install @x402/fetch @x402/evm viem axios

# 3. Add "type": "module" to package.json
```

---

## 🔐 Security Notes

- Store private keys in `~/.lobpay/config.json` (user home directory)
- Never commit credentials
- X402 payments are signed locally, never transmitted as plain text
- API keys only sent to configured `LOBPAY_API_URL`

---

## 🌐 Environment Variables

```bash
LOBPAY_API_URL=http://localhost:3000  # or https://lobpay.market
```

## ⛓️ Network Info

| Network | Chain ID | USDC Address |
|---------|----------|--------------|
| Base Sepolia | 84532 | 0x036CbD53842c5426634e7929541eC2318f3dCF7e |
| Base Mainnet | 8453 | 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 |

---

## 🐛 Troubleshooting

| Error | Solution |
|-------|----------|
| `Address "null" is invalid` | Run checkout.js first to verify merchant wallet |
| `401 Unauthorized` | Check API key in config |
| `Insufficient allowance` | Approve USDC spend in wallet first |
| `Payment expired` | Retry - timestamps are short-lived |

---

**Resources:**
- X402 Spec: https://github.com/coinbase/x402
- Base Docs: https://docs.base.org
