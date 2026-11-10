# Security checklist

- Identity: verify signed InterLink JWTs server-side against the confirmed issuer, audience and JWKS endpoint. Never accept a browser-provided user ID as identity.
- Secrets: keep database URLs, admin tokens and identity configuration in server environment variables only.
- Production: `DEV_AUTH_ENABLED` must remain false. The development header is blocked whenever `NODE_ENV=production`.
- Input: validate request bodies with Zod, cap JSON payloads at 32 KB and rate-limit requests.
- Output: render user content as text; never inject raw HTML.
- Headers: Helmet and Vercel security headers are enabled.
- Database: use least-privilege credentials and TLS; back up before migrations.
- Moderation: reports can be queued and reviewed; removed content is not returned by public endpoints.
- Privacy: collect only the external identity subject and display name needed for the MVP. Do not request wallet keys, recovery phrases, government IDs or payment information.
- No financial features: this product phase has no token transfers, payments, exchange, withdrawals, staking or redeemable rewards.
- Before launch: perform dependency review, access-control tests, abuse tests, backup restore test and a human moderation review.
