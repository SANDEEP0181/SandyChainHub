import "dotenv/config";
import { Address } from "@ton/core";
import { AssetsSDK, createApi, createSender, importKey } from "@ton-community/assets-sdk";

const NETWORK = "testnet";
const COLLECTION = process.env.COLLECTION_ADDRESS;
const RECIPIENT = process.env.CLAIM_RECIPIENT;

if (!process.env.MNEMONIC) throw new Error("MNEMONIC is required locally. Never commit or share it.");
if (!COLLECTION) throw new Error("COLLECTION_ADDRESS is required.");
if (!RECIPIENT) throw new Error("CLAIM_RECIPIENT is required.");

const api = await createApi(NETWORK);
const keyPair = await importKey(process.env.MNEMONIC);
const sender = await createSender("highload-v2", keyPair, api);
const sdk = AssetsSDK.create({ api, sender });
const collection = sdk.openNftCollection(Address.parse(COLLECTION));

console.log("Goalkeeper Genesis NFT mint");
console.log("Network: TON Testnet");
console.log("Collection:", COLLECTION);
console.log("Recipient:", RECIPIENT);
console.log("This requires the collection admin wallet and testnet TON for network fees.");

const item = await collection.sendMint({
  owner: Address.parse(RECIPIENT),
  itemIndex: 0,
  amount: "0.05",
  content: "genesis-keeper.json"
});

console.log("Mint request submitted.");
console.log("Result:", item);
console.log("Verify the NFT item on a TON Testnet explorer before marking the profile as minted.");
