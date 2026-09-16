# SandyChainHub

SandyChainHub is a lightweight, testnet-only Web3 builder and community dashboard.

## MVP features

- Register builder projects on-chain
- Browse registered projects
- Create community proposals
- Vote Yes/No once per proposal per wallet
- Browser wallet connection through ethers.js
- Solidity contract with events
- Hardhat automated tests
- Minimal ABI included for frontend integration

## Repository structure

```text
SandyChainHub/
├── contracts/
│   └── SandyChainHub.sol
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── config.js
├── abi/
│   └── SandyChainHub.json
├── test/
│   └── SandyChainHub.test.js
├── docs/
│   ├── architecture.md
│   ├── security.md
│   └── submission.md
├── hardhat.config.js
├── package.json
└── README.md
```

## Local development

Requirements: Node.js and npm.

```bash
npm install
npm run compile
npm test
```

The tests run entirely against Hardhat's local development network. No real funds or live network are required.

## Frontend

After a testnet deployment, set the contract address in `frontend/config.js`.

Then serve the frontend from the `frontend` folder, for example:

```bash
cd frontend
python -m http.server 3000
```

Open `http://localhost:3000` in a browser with a compatible wallet extension.

## Configuration safety

Never put a private key, seed phrase, recovery phrase, or other wallet secret in this repository. The frontend only needs the public contract address and network metadata.

## Testnet scope

This MVP intentionally contains no token issuance, payments, custody, withdrawals, yield promises, or investment-return logic. Before any production/mainnet use, perform an appropriate security review and verify the current official network requirements.

## Builder submission checklist

Before submitting to any external builder program, verify the current official program rules, supported network, deployment requirements, deadline, application process, and reward eligibility. This repository does not guarantee eligibility or rewards.
