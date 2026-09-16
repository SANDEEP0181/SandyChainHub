# Architecture

```text
Browser UI
   |
   | ethers.js + browser wallet
   v
SandyChainHub.sol
   |
   v
EVM-compatible testnet
```

## Contract responsibilities

- Store registered projects and builder addresses.
- Store community proposals.
- Record Yes/No votes.
- Prevent duplicate voting on the same proposal by the same wallet.
- Emit events for project registration, proposal creation, and voting.

## Frontend responsibilities

- Connect to the user's browser wallet.
- Read project/proposal counters and records.
- Submit project and proposal transactions.
- Submit votes.
- Render public on-chain data without handling private keys.

The frontend is intentionally static so it can later be hosted on a simple static hosting service.
