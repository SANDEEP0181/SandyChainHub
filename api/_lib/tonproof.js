import crypto from "node:crypto";

const TONAPI_BASE = "https://testnet.tonapi.io/v2";
const TON_PROOF_PREFIX = "ton-proof-item-v2/";
const TON_CONNECT_PREFIX = "ton-connect";
const MAX_PROOF_AGE_SECONDS = 15 * 60;
const ALLOWED_DOMAIN = "sandeep0181.github.io";

export function normalizeTonAddress(address) {
  return String(address || "").trim();
}

function friendlyToRaw(address) {
  if (/^-?\d+:[0-9a-fA-F]{64}$/.test(address)) return address;
  if (!/^[EU]Q[A-Za-z0-9_-]{46}$/.test(address)) throw new Error("Unsupported TON address format");
  const data = Buffer.from(address, "base64url");
  if (data.length !== 36) throw new Error("Invalid friendly TON address");
  const tag = data[0];
  const wcByte = data[1];
  const body = data.subarray(0, 34);
  const crc = data.readUInt16LE(34);
  let crcValue = 0;
  for (const byte of body) {
    crcValue ^= byte << 8;
    for (let i = 0; i < 8; i++) crcValue = (crcValue & 0x8000) ? ((crcValue << 1) ^ 0x1021) & 0xffff : (crcValue << 1) & 0xffff;
  }
  if (crc !== crcValue) throw new Error("Invalid TON address checksum");
  const bounceTag = tag & 0x7f;
  if (bounceTag !== 0x11 && bounceTag !== 0x51) throw new Error("Unsupported TON address tag");
  if ((tag & 0x80) !== 0 && !address.startsWith("UQ")) throw new Error("Invalid testnet TON address flag");
  const wc = wcByte === 0xff ? -1 : wcByte;
  return wc + ":" + data.subarray(2, 34).toString("hex");
}

function publicKeyObject(hex) {
  const raw = Buffer.from(hex, "hex");
  if (raw.length !== 32) throw new Error("Invalid TON public key");
  const prefix = Buffer.from("302a300506032b6570032100", "hex");
  return crypto.createPublicKey({ key: Buffer.concat([prefix, raw]), format: "der", type: "spki" });
}

async function getOnchainPublicKey(rawAddress) {
  const response = await fetch(TONAPI_BASE + "/accounts/" + encodeURIComponent(rawAddress) + "/publickey", { headers: { Accept: "application/json" } });
  if (!response.ok) return null;
  const data = await response.json();
  return typeof data.public_key === "string" ? data.public_key : (typeof data.publicKey === "string" ? data.publicKey : null);
}

export async function verifyTonProof(input) {
  try {
    if (!input || input.network !== "-3") return { ok: false, error: "Wrong TON network" };
    const rawAddress = friendlyToRaw(String(input.address || ""));
    const parts = rawAddress.split(":");
    const workchain = Number(parts[0]);
    const hash = Buffer.from(parts[1], "hex");
    if (workchain !== 0 || hash.length !== 32) return { ok: false, error: "Only TON workchain 0 is supported" };

    const proof = input.proof || {};
    const domain = proof.domain || {};
    const timestamp = Number(proof.timestamp);
    const now = Math.floor(Date.now() / 1000);
    if (!Number.isFinite(timestamp) || timestamp > now + 60 || now - timestamp > MAX_PROOF_AGE_SECONDS) return { ok: false, error: "TON proof expired" };

    const domainBytes = Buffer.from(String(domain.value || ""), "utf8");
    if (domain.value !== ALLOWED_DOMAIN || Number(domain.lengthBytes) !== domainBytes.length) return { ok: false, error: "TON proof domain mismatch" };
    if (typeof proof.payload !== "string" || proof.payload.length < 16 || proof.payload.length > 512) return { ok: false, error: "Invalid TON proof payload" };

    const expectedKey = await getOnchainPublicKey(rawAddress);
    if (!expectedKey || expectedKey.toLowerCase() !== String(input.publicKey || "").toLowerCase()) return { ok: false, error: "TON wallet public key does not match the address" };

    const wc = Buffer.alloc(4); wc.writeInt32BE(workchain, 0);
    const ts = Buffer.alloc(8); ts.writeBigUInt64LE(BigInt(timestamp), 0);
    const dl = Buffer.alloc(4); dl.writeUInt32LE(domainBytes.length, 0);
    const message = Buffer.concat([Buffer.from(TON_PROOF_PREFIX), wc, hash, dl, domainBytes, ts, Buffer.from(proof.payload)]);
    const msgHash = crypto.createHash("sha256").update(message).digest();
    const finalHash = crypto.createHash("sha256").update(Buffer.concat([Buffer.from([0xff, 0xff]), Buffer.from(TON_CONNECT_PREFIX), msgHash])).digest();
    const signature = Buffer.from(String(proof.signature || ""), "base64");
    if (signature.length !== 64) return { ok: false, error: "Invalid TON proof signature" };

    if (!crypto.verify(null, finalHash, publicKeyObject(String(input.publicKey)), signature)) {
      return { ok: false, error: "TON proof signature verification failed" };
    }
    return { ok: true, address: rawAddress };
  } catch (error) {
    return { ok: false, error: error.message || "TON proof verification failed" };
  }
}
