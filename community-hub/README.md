# InterLink Community Hub

Bilingual English/Hindi community-first mini-app workspace inside the existing SandyChainHub repository.

## Phase 1 modules
- Home and community feed
- Posts, comments, likes and user reports (REST API)
- Marketplace directory and enquiry records (no payments)
- Learning courses, lessons and progress tracking
- Moderation report queue API
- InterLink identity verification adapter (fail-closed until official App ID verification settings are confirmed)

## Stack
React 18, TypeScript, Vite, Express, Prisma, PostgreSQL, Zod, Helmet, JWT/JWKS verification and Vercel Node Functions.

## Local setup
```bash
npm install
cp .env.example .env
```
Set `DATABASE_URL` in `.env`, then:
```bash
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

The Vite frontend runs at `http://localhost:5173`. Vercel serves the API under `/api/*` in the same project.

## Validation
```bash
npm run build
npm run typecheck:server
npm test
```

## Deploy
See [Deployment Guide](docs/DEPLOYMENT.md). Vercel Root Directory must be `community-hub`. Set a managed PostgreSQL database and server-only environment variables before activating data features.

## Security boundaries
- No wallet connection, token payments, transfers, staking, withdrawals or redeemable rewards.
- No client-supplied user IDs are trusted.
- InterLink identity writes remain disabled until the provider's issuer, audience and JWKS settings are confirmed for this registered app.
- Local development identity mode is not available in production.
- Never commit secrets, private keys or recovery phrases.
