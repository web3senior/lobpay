# 🦞 LobPay

Where clients are agents.

---
## Table of Contents
* [Open Agents Hackathon](#x402)
* [Problem](#x402)
* [Solution](#x402)
* [Demo](#x402)
* [Features](#x402)
* [Vision](#x402)
* [Userflow](#how-does-it-work)
* [Installation](#installation)
* [Endpoints](#configuration-settings)
* [Skill](#configuration-settings)
* [AI](#configuration-settings)
* [Team](#configuration-settings)
* [Contributing](#configuration-settings)
---

## Open Agents Hackathon




## The Gateway for Autonomous Commerce

**LobPay** (derived from the "Lobster" vibes of the OpenClaw protocol) is a high-performance, decentralized marketplace designed specifically for AI Agents. It serves as the "Amazon for Agents," providing the infrastructure for autonomous entities to provision, trade, and settle transactions using Web3 rails.


## Vision

In the era of agentic workflows, machines need a place to shop. LobPay provides a "Command Center" interface where:

- **AI Agents** can authenticate via EIP-191 signatures and programmatically purchase goods.
- **Merchants** can list digital or physical inventory (Food, Fashion, Compute) for non-human consumers.
- **Reputation** is handled through ERC-8004 decentralized identities.

## Tech Stack

- **Frontend:** Next.js 16+ (App Router)
- **Database:** MariaDB / MySQL
- **Auth:** Web3 Signatures (Viem/Ethers) & JWT
- **Styling:** 

## Database Architecture

The system utilizes a streamlined schema to handle high-frequency agent requests:

- **Agents Table:** Consolidated storage for wallet addresses, API keys, and ERC-8004 identities.
- **Merchants:** Supports various business types (Retailers, Wholesalers, Digital Goods) across 249+ countries.
- **Transactions:** Fully audited ledger tracking `transaction_hash` and `delivery_status`.
- **Feedback:** On-chain verified reviews for agent-to-merchant trust.

## 🚀 Getting Started

### 1. Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_NAME="LobPay"
NEXT_PUBLIC_BASE_URL="[https://lobpay.cash](https://lobpay.cash)"
DB_NAME="lobpay"
JWT_SECRET="your_secret_here"
```

### 2. Database Setup

Import the provided SQL dump to initialize the `lobpay` database:

```bash
mysql -u root -p lobpay < lobpay.sql
```

### 2. Running Development

```bash
npm install
npm run dev
```

## 🔐 Security Protocols

- Lowercase Integrity: All wallet addresses and ERC-8004 identities are automatically normalized to lowercase via database triggers for collision-free lookups.

- Nonce-Based Auth: Prevents replay attacks during agent registration.

- API Telemetry: Real-time tracking of request_count and last_request_at for every agent node.

## 📡 API endpoints

https://documenter.getpostman.com/view/31287350/2sBXcEmMBD

## Skill

[/skill.md](/skill.md)


## Journal
[View the Daily Development Journal](./JOURNAL.md).

## AI: where i used for this project
- Used for GIT commits messages

## Team
* [Amir Rahimi](./team/amir.md)

## Contributing

[/CONTRIBUTING.md](/CONTRIBUTING.md)