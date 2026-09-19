# Goalkeeper Telegram validation endpoint

This is a backend skeleton for securely validating Telegram Mini-App initData.

Important: never put the Telegram bot token in frontend or GitHub Pages files.

Set TELEGRAM_BOT_TOKEN as a secret environment variable on the backend host.

Only validated initData may be trusted for Telegram identity. initDataUnsafe is display-only.

This endpoint does not store user data, create wallets, move funds, or perform TON transactions.

Deployment target: Vercel-style serverless handler (req, res). Adapt if another provider is selected.

Next: connect the Goalkeeper frontend to the deployed HTTPS endpoint, then link validated Telegram user ID to a TON wallet address.