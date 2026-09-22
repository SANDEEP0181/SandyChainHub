# Goalkeeper Genesis NFT — TON Testnet

This folder defines the on-chain integration target for the **Genesis Keeper** achievement.

## Standard

- NFT interface: TEP-62
- Metadata: TEP-64
- Network: TON Testnet only
- Collection: Goalkeeper Genesis
- Item: Genesis Keeper

TON's NFT model uses a collection contract plus individual NFT item contracts. The collection exposes item addresses and metadata, while each item stores its owner and individual content. See the official TEP-62 specification and TON reference implementation.

## Deployment status

The repository intentionally does **not** contain a private key, mnemonic, or deployed collection address.

Before the claim button can submit an on-chain mint transaction:

1. Deploy a TEP-62-compatible collection to TON Testnet using the official TON NFT reference implementation.
2. Verify the collection and item interfaces.
3. Put the resulting **testnet collection address** into `collection-config.json`.
4. Connect Goalkeeper to that collection.
5. Keep the final wallet transaction behind an explicit user confirmation.

## Important

Testnet transactions can still require testnet TON for network fees. Goalkeeper must never request a seed phrase/private key and must not silently submit a wallet transaction.

Official references:
- TEP-62 NFT Standard: https://github.com/ton-blockchain/TEPs/blob/master/text/0062-nft-standard.md
- TON NFT reference implementation: https://github.com/ton-blockchain/nft-contract
