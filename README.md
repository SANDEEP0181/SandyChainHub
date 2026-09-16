# SandyChainHub

SandyChainHub is a founder-led, testnet-only Web3 builder and community dashboard for the SYSFI testnet.

## Product flow

**Founder → Community → Membership → Testnet Fee → Member Access**

- **Founder:** Sandeep Yadav — Founder & Builder
- **Network:** SYSFI Testnet (Chain ID 76081)
- **Membership:** one wallet can join once
- **Testnet fee:** 0.01 SYSFI testnet native token
- **Member access:** community members can create proposals and vote once per proposal
- **Builder access:** builders can register projects without membership

## MVP features

- Founder profile and deployment-based founder wallet display
- SYSFI testnet network configuration
- Testnet-only community membership
- Exact membership-fee validation on-chain
- Membership event and member counter
- Member-only community proposals
- Member-only Yes/No voting
- One vote per wallet per proposal
- Builder project registration and public project links
- Browser wallet connection through ethers.js
- Input escaping and HTTP/HTTPS project-link validation
- Hardhat automated tests

## Repository structure

```text
SandyChainHub/
├── contracts/
│   └── SandyChainHub.sol
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── membership.css
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

## Membership contract rules

The membership contract is intentionally restricted with `block.chainid == 76081`. The required fee is exactly `0.01 ether` in the contract's native testnet denomination. A wallet can become a member only once. On successful membership, the testnet fee is forwarded to the immutable founder address set at deployment.

The contract does not contain token issuance, investment returns, yield, custody, or withdrawal functions.

## Local development

Requirements: Node.js and npm.

```bash
npm install
npm run compile
npm test
```

The Hardhat test network uses Chain ID 76081 so the test suite can exercise the same testnet-only membership guard without using a public network.

## Frontend

After a SYSFI testnet deployment, set the deployed public contract address in `frontend/config.js`.

Then serve the frontend from the `frontend` folder, for example:

```bash
cd frontend
python -m http.server 3000
```

Open `http://localhost:3000` in a browser with a compatible test wallet connected to SYSFI Testnet.

## Configuration safety

Never put a private key, seed phrase, recovery phrase, API secret, or wallet password in this repository. The frontend only needs a public contract address and public network metadata.

The founder wallet is taken from the deployed contract's public `founder()` value; a personal wallet address is not hard-coded into the frontend.

## Testnet scope

This project is intentionally limited to educational/testnet use. The membership fee is a testnet-native asset and should not be treated as a real-money payment or investment. No production/mainnet fee mechanism is enabled.

Before any production/mainnet use, perform an appropriate independent security review and verify the current official network requirements.

## Builder submission checklist

Before submitting to any external builder program, verify the current official program rules, supported network, deployment requirements, deadline, application process, and reward eligibility. This repository does not guarantee eligibility or rewards.
