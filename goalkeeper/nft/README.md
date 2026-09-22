# Goalkeeper Genesis NFT — TON Testnet

This folder contains the **testnet-only** NFT collection/mint integration for Goalkeeper Genesis Keeper.

## On-chain model

Goalkeeper uses the standard TON NFT architecture: a collection contract plus individual NFT item contracts. The collection is the source of truth for item addresses and collection metadata; each item stores its owner and individual metadata. citeturn1search3

## Files

- `collection-config.json` — deployment state and collection metadata.
- `genesis-keeper.json` — TEP-64 item metadata.
- `genesis-keeper.svg` — achievement artwork.
- `package.json` — isolated NFT deployment package.
- `deploy-collection.mjs` — creates the Goalkeeper Genesis collection on TON Testnet.
- `mint-genesis.mjs` — mints Genesis Keeper item #0 to an explicitly supplied testnet address.
- `.env.example` — local environment template only.

The deployment helpers use the TON Community Assets SDK, which supports creating NFT collections, opening collections, and minting NFT items on testnet. citeturn3search0

## Safe deployment flow

1. Use a **TON Testnet** wallet only.
2. Keep the wallet mnemonic in a local ignored `.env` file. Never put it in GitHub or chat.
3. Deploy the collection.
4. Verify the returned collection address on a TON Testnet explorer.
5. Put the verified collection address into `collection-config.json`.
6. Mint Genesis Keeper item #0 to a testnet recipient.
7. Verify the NFT item on-chain.
8. Only after on-chain confirmation should the Goalkeeper frontend record the NFT as **minted**.

TON documentation recommends presenting a transaction preview before sending blockchain transactions. citeturn0search1

## Important

- This integration is **TON Testnet only**.
- Testnet transactions can still require testnet TON for network fees.
- No real-money reward is issued.
- Goalkeeper must never request a user's seed phrase/private key.
- The frontend must not mark an NFT as minted merely because eligibility was verified.
- The collection address remains blank until an actual testnet deployment is verified.

Official references:
- TON NFT architecture: https://github.com/ton-blockchain/docs/blob/main/content/contracts/standard/tokens/nft/how-it-works.mdx
- TON TEP-62: https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md
- TON NFT reference contracts: https://github.com/ton-blockchain/nft-contract
- TON Community Assets SDK: https://github.com/ton-community/assets-sdk
