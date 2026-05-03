# 🦞 LobPay

**Where the clients are agents.**

![LobPay Logo](/public/hero.png)

---
## 📖 Contents
* [Problem](#-problem)
* [Solution](#-solution)
* [Vision](#-vision)
* [Tech Stack](#-tech-stack)
* [Core Integrations](#-core-integrations)
* [Getting Started](#-getting-started)
* [Database Architecture](#-database-architecture)
* [Security Protocols](#-security-protocols)
* [API Endpoints](#-api-endpoints)
* [Skill & Journal](#-skill--journal)
* [Team](#-team)
* [References](#-references)
---

## Open Agents Hackathon ETHGlobal

The Open Agents hackathon by ETHGlobal is an online, asynchronous event focused on the intersection of AI agents and the Ethereum ecosystem [^1].

## 🏗️ The Project

**LobPay** (derived from the "Lobster" vibes of the OpenClaw protocol) is a high-performance, decentralized marketplace designed specifically for AI Agents. It serves as the "Amazon for Agents," providing the infrastructure for autonomous entities to provision, trade, and settle transactions using Web3 rails.

### 🔴 Problem

- **Friction in Skill Installation**: Installing separate skills for every individual merchant is a bottleneck that won't scale.
- **Hosting Limitations**: Agents running on local hardware (like a Mac mini) lack the persistent infrastructure of traditional e-commerce.
- **High Development Costs**: Modern websites are built for human eyes, requiring costly overhead to make them "agent-readable."

### 🟢 Solution

An all-in-one platform: install a single skill and connect to millions of merchants. 
LobPay provides a global gateway where the clients are agents, not humans. By providing a standardized API and payment layer, we enable machines to shop as efficiently as humans do today.

### 👁️ Vision

In the era of agentic workflows, users won't browse; they will delegate. LobPay provides the "Command Center" where:
- **AI Agents** authenticate via EIP-191 signatures.
- **Merchants** list inventory specifically for non-human consumers.
- **Reputation** is handled through ERC-8004 decentralized identities and ENS tracking.

## X402

[x402](https://github.com/x402-foundation/x402) is the open payment standard that enables services to charge for access to their APIs and content directly over HTTP. It is built around the HTTP `402 Payment Required` status code and allows clients to programmatically pay for resources without accounts, sessions, or credential management [^2].

## X402 Facilitator

In LobPay, we use the [x402 facilitator](https://docs.x402.org/#get-started-install-the-facilitator) to handle the payment process. 

## 🛠️ Tech Stack

- **Frontend:** Next.js 15+ (App Router)
- **Database:** MariaDB / MySQL
- **Blockchain Interface:** Wagmi, Viem, Reown
- **DeFi:** Uniswap Trade API & UniswapX
- **Identity:** ENS (Ethereum Name Service)
- **Storage:** 0G Storage (Decentralized Metadata)
- **Payments:** [x402 Standard](https://github.com/x402-foundation/x402)

## 🔗 Core Integrations

### 💾 0G Storage
In a significant architectural upgrade, I have replaced IPFS with 0G Storage to serve as the project's primary data persistence layer. While traditional e-commerce relies on centralized databases or slower peer-to-peer networks, LobPay utilizes 0G's high-speed, programmable DA layer to maintain all merchant products' assets/media files and metadata onchain.

- **Immutable Product Catalog**: Merchant inventory, including product descriptions and pricing metadata, is stored on 0G, ensuring the "Source of Truth" for AI agents is decentralized and tamper-proof.

- **Transaction Archives**: I archive immutable transaction metadata and agent interaction logs, eliminating the risks associated with centralized data silos.

- **Performance**: By leveraging 0G instead of IPFS, we achieve the data availability required for high-frequency agentic trading without sacrificing decentralized integrity.

### 🦄 Uniswap Revenue Swapper
Merchants can instantly liquidate their USDC earnings into assets like ETH or WBTC. We utilize **UniswapX** for Dutch Auction orders and **EIP-712 permit signatures**, allowing for gasless authorization and high-efficiency capital rotation.

### 🆔 ENS (Identity Track)
Every merchant node is linked to an **ENS domain**. This replaces complex hex addresses with human-readable business identities, allowing agents to "search" for merchants by name and providing a transparent reputation layer.

## Database Architecture

The system utilizes a streamlined schema to handle high-frequency agent requests:

- **Agents Table:** Consolidated storage for wallet addresses, API keys, and ERC-8004 identities.
- **Merchants:** Supports various business types (Retailers, Wholesalers, Digital Goods) across 249+ countries.
- **Transactions:** Fully audited ledger tracking `transaction_hash` and `delivery_status`.
- **Feedback:** On-chain verified reviews for agent-to-merchant trust.

## 🚀 Getting Started

```shell
# Clone the repository
git clone https://github.com/web3senior/lobpay

# Go to the project directory
cd lobpay

# Install dependencies
npm install

# Run the development server
npm run dev
```

### 1. Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_NAME="LobPay"
NEXT_PUBLIC_BASE_URL=""
NEXT_PUBLIC_TITLE=""
NEXT_PUBLIC_SLOGAN=""
NEXT_PUBLIC_DESCRIPTION=""
NEXT_PUBLIC_KEYWORDS=""
NEXT_PUBLIC_THEME_COLOR="#0000ff"
NEXT_PUBLIC_LOCALSTORAGE_PREFIX="__lobpay-v1-"
NEXT_PUBLIC_AUTHOR=""
NEXT_PUBLIC_AUTHOR_URL=""
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_UNISWAP_API_KEY=
NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_BASE_URL}/api" 
NEXT_PUBLIC_UPLOAD_URL="${NEXT_PUBLIC_BASE_URL}/upload/images"
NEXT_PUBLIC_REOWN_PROJECT_ID=""
NEXT_PUBLIC_VAPID_PUBLIC_KEY=""

# Database
DB_HOST="localhost"
DB_USER="root"
DB_PASSWORD=""
DB_NAME="lobpay"
DB_PORT=3306
PRIVATE_KEY=""

# 0G Storage
RPC_URL="https://evmrpc-testnet.0g.ai"
INDEXER_RPC="https://indexer-storage-testnet-turbo.0g.ai/"
NEXT_PUBLIC_INDEXER_URL=https://indexer-storage-testnet-turbo.0g.ai

JWT_SECRET=""
AGENT_API_KEY_PREFIX=""
PINATA_JWT=""
RELAYER_PRIVATE_KEY=""
```

### 2. Database Setup

Import the provided SQL dump to initialize the `lobpay` database:

```bash
mysql -u root -p lobpay < lobpay.sql
```

### 3. Running Development

```bash
npm install
npm run dev
```

## 🔐 Security Protocols

- **Lowercase Integrity**: Database triggers automatically normalize all wallet addresses and ERC-8004 IDs to prevent collision attacks.
- **Nonce-Based Auth**: Every agent interaction requires a unique nonce to prevent replay attacks during EIP-191 signing.
- **BigInt Serialization**: Custom JSON replacers in our swap hooks ensure high-precision financial data (USDC/ETH) is moved between frontend and API without rounding errors or crashes.

## 📡 API & Resources

- **API Documentation:** [Postman Collection](https://documenter.getpostman.com/view/31287350/2sBXcEmMBD)
- **Agent Skill:** [View Skill Configuration](./public/skill.md)
- **Development Journal:** [Read the Daily Logs](./JOURNAL.md)
- **Supported Networks:** Base Sepolia (Primary), LUKSO (Beta)

## Supported Networks

- Base Sepolia
- LUKSO (Loading...)

## Skill

[View Agent Skill Configuration](/public/skill.md)

## Journal
[View the Daily Development Journal](./JOURNAL.md).

## AI Integration
- **Code Optimization:** Advanced UI/UX components and SCSS modularity.
- **Middleware:** Managing complex proxying in Next.js for the Uniswap Gateway.
- **Content:** Generating conventional commit messages and refining documentation.

## Team
* **Amir Rahimi:** [Profile](./team/amir.md) / [GitHub](https://github.com/web3senior)

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## References

[^1]: [ETHGlobal Open Agents Hackathon](https://ethglobal.com/events/openagents)

[^2]: [x402](https://github.com/x402-foundation/x402)