# InterLink Community Hub — Repository Audit & Phase 1 Plan

Audit date: 2026-11-10  
Repository: `SANDEEP0181/SandyChainHub`  
Base branch: `main`  
Implementation branch: `feature/interlink-community-hub-phase1`

## 1. Existing repository findings

- The repository default branch is `main`.
- Root `package.json` is a Hardhat/Solidity workspace. Its scripts compile and test contracts and include SYSFI deployment scripts.
- The legacy browser app is under `frontend/` and uses plain HTML, CSS and JavaScript with Ethers.js.
- `frontend/config.js` contains a SYSFI testnet contract address, chain ID 76081 and explorer base URL.
- `frontend/app.js` connects to an injected EVM wallet, checks the SYSFI chain ID and calls the existing contract.
- `contracts/SandyChainHub.sol` is a SYSFI-testnet-only builder registry and proposal/voting contract. It includes a membership-fee path and transfers that fee to a configured founder address.
- `goalkeeper/` is a separate TON/Telegram Mini-App area with its own assets and scripts.
- The repository has a root Hardhat workflow. No Vercel project configuration or frontend package manifest was found at the repository root or in the legacy `frontend/` directory during this audit.

## 2. Safety and separation decisions

- Do not overwrite or refactor `frontend/`, `contracts/`, `scripts/`, or `goalkeeper/` as part of this Phase 1 preview.
- Keep the new InterLink Community Hub isolated in `community-hub/`.
- Do not connect the new app to the legacy SYSFI membership-fee contract.
- Do not add wallet signing, token transfer, payment, exchange, withdrawal, or redeemable reward functionality.
- Treat the InterLink sign-in integration as pending until an official App ID and a verified integration contract are available.
- Do not store private keys, seed phrases, authentication tokens or other secrets in frontend code or Git.

## 3. Phase 1 preview currently added

- React + TypeScript + Vite workspace under `community-hub/`.
- English/Hindi language switch.
- Mobile-first Home, Community, Learning, Marketplace and Profile views.
- Sample posts with local in-memory like state.
- Sample learning paths and marketplace listings.
- Clear preview notice explaining that data is sample-only and backend features are not connected.
- A dedicated GitHub Actions build workflow for the new workspace.

This is a frontend preview only. It does not yet provide persistent accounts, publishing, moderation, course progress, listing enquiries or a production backend.

## 4. Proposed production architecture after review

- Frontend: React + TypeScript + Vite; Vercel project root set to `community-hub/`.
- Backend: separately deployed Node.js + TypeScript API with strict request validation and rate limits.
- Database: PostgreSQL for user profiles, posts, comments, reports, listings, enquiries, courses and lesson progress.
- Media: private-by-default object storage with upload size/type validation and safe image processing.
- Identity: InterLink MDK adapter behind a server-validated authentication boundary; do not trust client-provided identity claims.
- Moderation: report queues, admin roles, audit logs, spam controls and user-content removal workflow.
- Languages: English and Hindi strings kept separate from content data.

## 5. Next implementation milestones

1. Verify GitHub Actions build for this branch and resolve any compiler errors.
2. Connect a separate Vercel project with Root Directory = `community-hub`, Build Command = `npm run build`, Output Directory = `dist`.
3. Confirm official InterLink App ID and current MDK package/version requirements before enabling sign-in.
4. Design and review the API and PostgreSQL schema.
5. Implement authenticated community posts, comments and moderation.
6. Implement learning content and progress tracking.
7. Implement marketplace discovery and enquiry records (no payment processing).
8. Complete accessibility, security, mobile and bilingual QA before production launch.

## 6. Current release status

**Phase 1 frontend preview scaffolded; backend, official InterLink authentication, persistence and production verification remain pending.**
