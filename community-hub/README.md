# InterLink Community Hub — Phase 1 Preview

A separate, bilingual (English/Hindi) React + TypeScript frontend workspace inside the existing SandyChainHub repository.

## Included in this preview
- Mobile-first Home, Community, Learning, Marketplace and Profile views
- English/Hindi language switch
- Sample community posts with in-memory like interaction
- Sample learning paths and community listings
- Green/white visual system

## Important boundaries
- This is a frontend preview, not a production community platform.
- Content is sample data; posts, likes and listings are not persisted.
- Sign-in is not connected. InterLink MDK integration is intentionally pending official App ID and integration verification.
- No wallet connection, token actions, payment, transfer, or redeemable rewards are implemented.
- Do not enter personal, account, wallet, or payment information into this preview.

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Vercel
Create a Vercel project linked to this repository and set **Root Directory** to `community-hub`. Build command: `npm run build`; output directory: `dist`. The existing `frontend/` and `goalkeeper/` folders are separate and should remain untouched.

## Next engineering phase
Add a reviewed backend and database for accounts, moderation, community posts, learning progress and listing enquiries. Complete security review and test flows before production use.
