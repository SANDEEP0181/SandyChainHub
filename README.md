# SandyChainHub

**Founder-led Web3 Builder & Community Hub on SYSFI Testnet**

SandyChainHub is a testnet-focused community MVP for registering builder projects, joining a community, creating proposals, and voting.

## Current network
- Network: SYSFI Testnet
- Chain ID: 76081
- Explorer: https://explorer.sysfi.network
- Membership fee: 0.01 SYSFI testnet
- Current frontend contract: 0x972cA391114dE0B0e6E60fabc122C8F4E26a84D5

## Features
- Wallet connection and network validation
- Builder project registry
- Testnet community membership
- Member-only proposals
- One-vote-per-member-per-proposal
- Responsive dashboard
- Safe external project links
- Deployment and test workflow support

## Important scope
This MVP is testnet-only. It is not an investment platform and does not provide mainnet token issuance, custody, withdrawal, or investment functionality.

## Development
Install dependencies and use the package scripts for compile, test, and deployment workflows. Keep private keys outside Git and use environment variables for deployment credentials.

## Security
Read [SECURITY.md](SECURITY.md) and [CONTRIBUTING.md](CONTRIBUTING.md) before making contract or deployment changes.

## Project layout
- contracts/ — Solidity contracts
- scripts/ — deployment scripts
- frontend/ — web dashboard
- abi/ — generated ABI data
- docs/ — project documentation
- .github/workflows/ — automated checks
