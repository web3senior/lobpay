# 🦞 LobPay

Where the clients are agents.

![LobPay Logo](/public/hero.png)

---
## Contents
* [Open Agents Hackathon](#🏆-open-agents-hackathon-ethglobal-2026)
* [AI Agents](#ai-agents)
* [Problem](#problem)
* [Solution](#solution)
* [Vision](#vision)
* [X402](#x402)
* [X402 Facilitator](#x402-facilitator)
* [Tech Stack](#tech-stack)
* [Database Architecture](#database-architecture)
* [Getting Started](#getting-started)
* [Security Protocols](#security-protocols)
* [API Endpoints](#api-endpoints)
* [Supported Networks](#supported-networks)
* [Skill](#skill)
* [Journal](#journal)
* [AI Integration](#ai-integration)
* [Team](#team)
* [Contributing](#contributing)
* [References](#references)

---

## 🏆 Open Agents Hackathon ETHGlobal, 2026
The Open Agents hackathon by ETHGlobal is an online, asynchronous event focused on the intersection of AI agents and the Ethereum ecosystem [^1].

## 🦞 AI Agents

**LobPay** (derived from the "Lobster" vibes of the OpenClaw protocol) is a high-performance, decentralized marketplace designed specifically for AI Agents. It serves as the "Amazon for Agents," providing the infrastructure for autonomous entities to provision, trade, and settle transactions using Web3 rails.

## Problem
- **Friction in Skill Installation**: Installing skills for every individual merchant will become a significant bottleneck in the future. While early adopters manage it today, it will not scale for mainstream usage.
- **Security & Hosting Limitations**: AI agents often run locally on user-owned hardware (like a Mac mini) rather than dedicated servers, presenting challenges for persistent, secure interactions.
- **Development Costs for E-commerce**: Traditional websites are designed for humans and require continuous costly updates to support agentic interactions.
- **Support Overhead**: Managing individual agent integrations across diverse e-commerce platforms is inefficient.

## Solution
An all-in-one platform: install a single skill and connect to millions of merchants. This is the future.
LobPay provides a global gateway for all merchants where the clients are agents, not humans. Think of it as Amazon, but designed from the ground up for AI agents.

## Vision
We believe that very soon, users won't open browsers to explore websites or use Google to search and buy. Instead, they will ask their AI agents to do it—seamlessly, fast, and securely.
In the era of agentic workflows, machines need a place to shop. LobPay provides a "Command Center" interface where:

- **AI Agents** can authenticate via EIP-191 signatures and programmatically purchase goods.
- **Merchants** can list digital or physical inventory (Food, Fashion, Compute) for non-human consumers.
- **Reputation** is handled through ERC-8004 decentralized identities.

## X402
[x402](https://github.com/x402-foundation/x402) is the open payment standard that enables services to charge for access to their APIs and content directly over HTTP. It is built around the HTTP `402 Payment Required` status code and allows clients to programmatically pay for resources without accounts, sessions, or credential management [^1].

## X402 Facilitator

In LobPay, we use the [x402 facilitator](https://docs.x402.org/#get-started-install-the-facilitator) to handle the payment process. 

## Tech Stack

- **Frontend:** Next.js 16+ (App Router)
- **Database:** MariaDB / MySQL
- **Auth:** Web3 Signatures (Viem/Ethers) & JWT
- **Styling:** SCSS / Custom CSS

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
NEXT_PUBLIC_BASE_URL="https://lobpay.vercel.app"
DB_NAME="lobpay"
JWT_SECRET="your_secret_here"
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

- **Lowercase Integrity**: All wallet addresses and ERC-8004 identities are automatically normalized to lowercase via database triggers for collision-free lookups.
- **Nonce-Based Auth**: Prevents replay attacks during agent registration.
- **API Telemetry**: Real-time tracking of `request_count` and `last_request_at` for every agent node.

## 📡 API Endpoints

Explore our API documentation: [Postman Docs](https://documenter.getpostman.com/view/31287350/2sBXcEmMBD)

## Supported Networks
- Base
- LUKSO (Loading...)

## Skill

[View Agent Skill Configuration](/public/skill.md)

## Journal
[View the Daily Development Journal](./JOURNAL.md).

## AI Integration
- **Git:** Used AI for generating conventional commit messages.
- **Development:** Used AI for UI/UX, commenting, improving README, fixing bugs, and guidance with proxying in Next.js.

## Team
* [Amir Rahimi](./team/amir.md)

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## References

[^1]: [ETHGlobal Open Agents Hackathon](https://ethglobal.com/events/openagents)