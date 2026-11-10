# InterLink Community Hub — Repository Audit & Phase 1 Handoff

Audit date: 2026-11-10  
Repository: `SANDEEP0181/SandyChainHub`  
Base branch: `main`  
Implementation branch: `feature/interlink-community-hub-phase1`  
Pull request: [#50 — Build InterLink Community Hub Phase 1](https://github.com/SANDEEP0181/SandyChainHub/pull/50)

## 1. Existing repository findings

- Default branch is `main`.
- Root `package.json` is a Hardhat/Solidity workspace.
- The legacy browser app is under `frontend/` and uses plain HTML, CSS and JavaScript with Ethers.js.
- `frontend/config.js` points to the existing SYSFI testnet configuration.
- `contracts/SandyChainHub.sol` is a separate SYSFI-testnet builder registry/proposal contract and contains its own membership-fee behavior.
- `goalkeeper/` is a separate TON/Telegram Mini-App.
- The legacy app, contracts, scripts and Goalkeeper folder have not been refactored by this Hub implementation.

## 2. Phase 1 implementation now present

- React + TypeScript + Vite bilingual frontend in `community-hub/`.
- Home, Community, Learning, Marketplace discovery and Profile views.
- API-backed public feed, course catalogue, lesson viewer and curated listing directory, with sample fallback.
- Express API endpoints for feed, post creation, comments, likes, reports, courses, lessons and lesson progress.
- Prisma/PostgreSQL schema plus an initial SQL migration and seed script.
- Admin moderation console at `/admin`, protected by a server-side admin token.
- Moderators can review reports and hide or remove reported posts.
- Zod validation, request size limits, rate limiting, Helmet and Vercel security headers.
- GitHub Actions workflow for Prisma validation, frontend build, API type-check and validation tests.
- Vercel config, environment example, API docs, security checklist and deployment guide.

## 3. Safety boundaries

- No wallet connection, token transfer, payment, exchange, staking, withdrawal or redeemable reward functionality.
- No direct messages, public contact exchange or location collection.
- Marketplace is discovery-only; direct enquiries are disabled.
- Public post/comment validation rejects common links and contact-detail patterns.
- InterLink identity is fail-closed until official App ID and server-verification details are confirmed.
- Development identity headers are accepted only outside production.

## 4. Automated validation

The Community Hub GitHub Actions workflow completed successfully on the implementation commit:
- Prisma schema validation — passed
- Frontend production build — passed
- API TypeScript check — passed
- Validation tests — passed

The first legacy Hardhat PR run also executed and found two existing contract-test expectation failures unrelated to the Community Hub: one expects the deployer to be the founder while the contract contains a fixed founder address, and one asserts an exact block timestamp. The legacy workflow has been scoped to contract-workspace paths so Hub-only changes do not repeatedly trigger unrelated legacy tests.

## 5. External setup required before public launch

1. Vercel currently reports `build-rate-limit` for the two linked projects, so a preview deployment has not yet been confirmed.
2. Set Vercel Root Directory to `community-hub`, Build Command to `npm run build`, and Output Directory to `dist`.
3. Configure a managed PostgreSQL database and set `DATABASE_URL` in Vercel. Apply the committed migration and run the seed script from a trusted environment.
4. Configure `ADMIN_API_TOKEN` only as a server-side environment variable.
5. Obtain the official InterLink App ID and ask InterLink to confirm the JWT issuer, audience and JWKS verification endpoint. Do not guess these values.
6. After identity verification is approved, complete the SDK-to-server token handoff and test sign-in in the InterLink App.

## 6. Current release state

**Phase 1 code scaffold and automated Community Hub checks are complete on the feature branch.** Production launch remains blocked by external Vercel build quota, database configuration and official InterLink identity details. The draft PR is not merged into `main`.
