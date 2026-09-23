import crypto from "node:crypto";
import {
  redis,
  userKey,
  validateTelegramInitData,
  rateLimit,
  recordXpLedger,
  addRiskFlag
} from "../_lib/goalkeeper.js";
import { verifyTonProof, normalizeTonAddress } from "../_lib/tonproof.js";

const ALLOWED_ORIGIN = "https://sandeep0181.github.io";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");
}

function isValidTonAddress(address) {
  return typeof address === "string" &&
    /^(?:0:[0-9a-fA-F]{64}|EQ[A-Za-z0-9_-]{46}|UQ[A-Za-z0-9_-]{46})$/.test(address.trim());
}

function defaultState() {
  return { points: 0, streak: 0, bestStreak: 0, lastCheckin: null, missions: {} };
}

function parseState(raw) {
  try { return raw ? JSON.parse(raw) : defaultState(); }
  catch { return defaultState(); }
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return res.status(500).json({ ok: false, error: "Server is not configured" });

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  } catch {
    return res.status(400).json({ ok: false, error: "Invalid JSON body" });
  }

  const telegram = validateTelegramInitData(body.initData, botToken);
  if (!telegram.ok) return res.status(401).json(telegram);

  const limiter = await rateLimit(telegram.user.id, "identity", 5, 60);
  if (!limiter.ok) {
    try { await addRiskFlag(telegram.user.id, "IDENTITY_RATE_LIMIT", { windowSeconds: 60, limit: 5 }); } catch {}
    return res.status(429).json({ ok: false, error: "Too many identity requests. Try again shortly." });
  }

  const walletAddress = typeof body.walletAddress === "string" ? body.walletAddress.trim() : "";
  if (!isValidTonAddress(walletAddress)) return res.status(400).json({ ok: false, error: "Invalid TON wallet address" });
  const normalizedWallet = normalizeTonAddress(walletAddress);

  const proof = body.tonProof && typeof body.tonProof === "object" ? body.tonProof : null;
  const publicKey = typeof body.publicKey === "string" ? body.publicKey.trim() : "";
  const stateInit = typeof body.stateInit === "string" ? body.stateInit : "";
  const network = typeof body.network === "string" ? body.network : "";

  if (!proof || !publicKey || !stateInit) return res.status(400).json({ ok: false, error: "TON ownership proof is required" });
  if (network !== "-3") return res.status(400).json({ ok: false, error: "Goalkeeper requires TON testnet wallet proof" });

  const mutationKey = "gk:user-mutation-lock:" + String(telegram.user.id);
  const mutationLock = await redis(["SET", mutationKey, crypto.randomUUID(), "NX", "EX", "20"]);
  if (mutationLock !== "OK") {
    return res.status(409).json({
      ok: false,
      error: "Another identity update is in progress. Please retry shortly.",
      retryable: true
    });
  }

  const releaseMutationLock = async () => {
    try { await redis(["DEL", mutationKey]); } catch {}
  };

  let walletClaimedHere = false;
  let statePersisted = false;
  let leaderboardSynced = true;

  try {
    const payloadKey = "gk:tonproof:" + String(telegram.user.id);
    const expectedPayload = await redis(["GET", payloadKey]);
    if (!expectedPayload || proof.payload !== expectedPayload) {
      return res.status(401).json({ ok: false, error: "TON proof challenge is missing or expired" });
    }

    const proofResult = await verifyTonProof({
      address: normalizedWallet,
      network,
      publicKey,
      stateInit,
      proof
    });
    if (!proofResult.ok) {
      return res.status(401).json({ ok: false, error: proofResult.error || "TON ownership proof failed" });
    }

    const walletKey = "gk:wallet-owner:" + normalizedWallet;
    const owner = await redis(["GET", walletKey]);

    if (owner && String(owner) !== String(telegram.user.id)) {
      return res.status(409).json({ ok: false, error: "This TON wallet is already linked to another Goalkeeper account" });
    }

    if (!owner) {
      const claimed = await redis(["SET", walletKey, String(telegram.user.id), "NX"]);
      if (claimed === "OK") {
        walletClaimedHere = true;
      } else {
        const raceOwner = await redis(["GET", walletKey]);
        if (String(raceOwner) !== String(telegram.user.id)) {
          return res.status(409).json({ ok: false, error: "This TON wallet is already linked to another Goalkeeper account" });
        }
      }
    }

    const key = userKey(telegram.user.id);
    const raw = await redis(["GET", key]);
    const state = parseState(raw);

    if (state.walletAddress && state.walletAddress !== normalizedWallet) {
      if (walletClaimedHere) {
        try { await redis(["DEL", walletKey]); } catch {}
      }
      return res.status(409).json({
        ok: false,
        error: "Wallet change requires security review. Your existing verified wallet remains linked."
      });
    }

    state.missions = state.missions || {};
    const identityAlreadyComplete = Boolean(state.missions.identity);

    if (!identityAlreadyComplete) {
      state.points = Number(state.points || 0) + 15;
      state.missions.identity = {
        completedAt: new Date().toISOString(),
        points: 15
      };
    }

    state.walletAddress = normalizedWallet;
    state.walletVerifiedAt = new Date().toISOString();
    state.walletProofVerified = true;

    await redis(["SET", key, JSON.stringify(state)]);
    statePersisted = true;

    // Challenge is one-time. It is removed after the canonical state is saved.
    await redis(["DEL", payloadKey]);

    try {
      await redis(["ZADD", "gk:leaderboard", state.points, String(telegram.user.id)]);
    } catch {
      leaderboardSynced = false;
      try {
        await addRiskFlag(telegram.user.id, "IDENTITY_LEADERBOARD_SYNC", {});
      } catch {}
    }

    if (!identityAlreadyComplete) {
      try {
        await recordXpLedger(telegram.user.id, "identity:once", {
          type: "mission",
          missionId: "identity",
          points: 15,
          source: "identity-link"
        });
      } catch {}
    }

    return res.status(200).json({
      ok: true,
      status: "linked",
      walletAddress: state.walletAddress,
      telegramUserId: telegram.user.id,
      proofVerified: true,
      rewardAwarded: !identityAlreadyComplete,
      leaderboardSynced
    });
  } catch (error) {
    if (walletClaimedHere && !statePersisted) {
      try {
        const walletKey = "gk:wallet-owner:" + normalizedWallet;
        const currentOwner = await redis(["GET", walletKey]);
        if (String(currentOwner) === String(telegram.user.id)) await redis(["DEL", walletKey]);
      } catch {}
    }
    return res.status(503).json({ ok: false, error: error.message || "Storage unavailable" });
  } finally {
    await releaseMutationLock();
  }
}
