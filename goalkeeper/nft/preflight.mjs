import fs from "node:fs/promises";
import { Address } from "@ton/core";

const config=JSON.parse(await fs.readFile(new URL("./collection-config.json",import.meta.url),"utf8"));
if(config.network!=="ton-testnet") throw new Error("Safety check failed: network must be ton-testnet.");
if(String(config.chainId)!=="-3") throw new Error("Safety check failed: TON Testnet chainId must be -3.");
if(config.collectionAddress){ try{ Address.parse(config.collectionAddress); }catch{ throw new Error("collectionAddress is not a valid TON address."); } }
if(!String(config.collectionMetadataUrl).startsWith("https://")) throw new Error("Metadata URL must use HTTPS.");

const response=await fetch(config.collectionMetadataUrl,{redirect:"error"});
if(!response.ok) throw new Error(`Metadata URL returned HTTP ${response.status}.`);
const metadata=await response.json();
for(const key of ["name","description","image"]) if(!metadata[key]) throw new Error(`Metadata is missing required field: ${key}`);

console.log("Goalkeeper Genesis NFT preflight: PASS");
console.log("Network: TON Testnet (-3)");
console.log("Collection address:",config.collectionAddress||"NOT DEPLOYED");
console.log("Metadata URL:",config.collectionMetadataUrl);
console.log("No wallet transaction was submitted.");
