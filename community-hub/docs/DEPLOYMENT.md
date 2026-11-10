# Deployment — GitHub + Vercel

## Vercel project
1. Import the existing `SANDEEP0181/SandyChainHub` repository into Vercel.
2. Select the `feature/interlink-community-hub-phase1` branch for preview deployment.
3. Set Root Directory to `community-hub`.
4. Framework preset: Vite.
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. Install command: `npm install`.

The `api/[...path].ts` file is deployed as a Vercel Node function. Keep the frontend and API in the same project so same-origin API requests work.

## Environment variables
Set the following in Vercel Project Settings → Environment Variables:
- `DATABASE_URL`: managed PostgreSQL connection string with TLS.
- `CORS_ORIGIN`: deployed Hub origin.
- `ADMIN_API_TOKEN`: long random server-only secret.
- `INTERLINK_JWKS_URL`, `INTERLINK_ISSUER`, `INTERLINK_AUDIENCE`: only after InterLink confirms the values for this registered app.

Never add secrets to GitHub files, Vite `VITE_*` variables, screenshots or client-side code.

## Database setup
Run locally or from a trusted migration environment:
```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
```
For production, commit reviewed Prisma migrations and use `npm run db:migrate`. Do not use `db push` as an ongoing production migration process.

## Preview limitations
Until database and identity variables are configured, the site can render its sample UI but persistent content and authenticated actions will not be active. The production identity adapter intentionally fails closed.
