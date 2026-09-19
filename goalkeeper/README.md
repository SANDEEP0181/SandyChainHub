# Goalkeeper — TON + Telegram Mini-App

Goalkeeper is the TON and Telegram Mini-App foundation for SandyChainHub.

## Current stage

- Static Mini-App shell
- TON Connect wallet connection
- Public TON Connect manifest
- Telegram WebApp SDK integration
- Telegram-ready responsive UI
- Testnet-first development
- No mainnet transaction logic
- No private keys or seed phrases in the repository

## Telegram integration

The frontend loads Telegram's official Mini App JavaScript bridge and calls `Telegram.WebApp.ready()` and `expand()` when opened inside Telegram.

The UI may display basic client-side Telegram profile information supplied by the Telegram WebApp environment. **Do not use `initDataUnsafe` for authentication or authorization.** When a backend is added, it must validate `Telegram.WebApp.initData` on the server before trusting the user/session.

## Next setup outside GitHub

To make Goalkeeper launchable from Telegram, create/configure a Telegram bot with **@BotFather** and set the Goalkeeper GitHub Pages URL as the bot's Mini App URL. No bot token belongs in this repository.

## Roadmap

1. Verify Telegram launch
2. Keep TON Connect working inside Telegram
3. Add server-side Telegram initData validation
4. Connect Telegram identity to SandyChainHub profile
5. Add TON-specific features after the foundation is stable

Official references:
- Telegram Mini Apps: https://core.telegram.org/bots/webapps
- TON WalletKit / TON Connect: https://docs.ton.org/applications/walletkit/overview
