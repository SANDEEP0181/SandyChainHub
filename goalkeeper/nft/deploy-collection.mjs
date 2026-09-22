import "dotenv/config";
import { AssetsSDK, createApi, createSender, importKey } from "@ton-community/assets-sdk";

const NETWORK = "testnet";
const METADATA = "https://sandeep0181.github.io/SandyChainHub/goalkeeper/nft/genesis-keeper.json";

if (!process.env.MNEMONIC) {
  throw new Error("MNEMONIC is required locally. Do not paste it into chat or commit it.");
}

const api = await createApi(NETWORK);
const keyPair = await importKey(process.env.MNEMONIC);
const sender = await createSender("highload-v2", keyPair, api);
const sdk = AssetsSDK.create({ api, sender });

const owner = process.env.COLLECTION_OWNER || sender.address?.toString();
if (!owner) throw new Error("Could not determine collection owner.");

console.log("Goalkeeper Genesis NFT collection deployment");
console.log("Network: TON Testnet");
console.log("Owner:", owner);
console.log("Metadata:", METADATA);
console.log("A blockchain transaction is about to be submitted by the configured testnet wallet.");

const collection = await sdk.createNftCollection({
  collectionContent: {
    name: "Goalkeeper Genesis",
    description: "Goalkeeper Genesis Keeper achievement collection. Testnet/community achievement only.",
    image: "https://sandeep0181.github.io/SandyChainHub/goalkeeper/nft/genesis-keeper.svg"
  },
  commonContent: METADATA,
  adminAddress: owner
});

console.log("Collection address:", collection.address.toString());
console.log("IMPORTANT: write this testnet address into collection-config.json only after checking the transaction on a TON Testnet explorer.");
