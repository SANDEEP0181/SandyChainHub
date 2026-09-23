import crypto from "node:crypto";
import { cors, validateTelegramInitData, redis, userKey, rateLimit, addRiskFlag, recordXpLedger } from "../_lib/goalkeeper.js";

const CODE_RE = /^GK-[A-Z0-9]{6}$/;
const REFERRAL_BONUS = 20;

function safeJson(raw, fallback) {
  try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
}

function hashId(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex").slice(0, 8).toUpperCase();
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return res.status(500).json({ ok: false, error: "Server is not configured" });

  let body;
  try { body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {}); }
  catch { return res.status(400).json({ ok: false, error: "Invalid JSON body" }); }

  const auth = validateTelegramInitData(body.initData, botToken);
  if (!auth.ok) return res.status(401).json(auth);

  const limiter = await rateLimit(auth.user.id, "referral", 10, 60);
  if (!limiter.ok) return res.status(429).json({ ok: false, error: "Too many referral requests. Try again shortly." });

  const code = typeof body.referralCode === "string" ? body.referralCode.trim().toUpperCase() : "";
  const action = body.action === "claim" ? "claim" : "register";
  if (!CODE_RE.test(code)) return res.status(400).json({ ok: false, error: "Invalid referral code" });

  try {
    const me = String(auth.user.id);
    const refKey = "gk:ref:" + code;

    if (action === "register") {
      const result = await redis(["SET", refKey, me, "NX"]);
      if (result === "OK") {
        return res.status(200).json({ ok: true, registered: true, referralCode: code });
      }
      const owner = await redis(["GET", refKey]);
      return res.status(200).json({ ok: true, registered: String(owner || "") === me, referralCode: code });
    }

    const inviter = await redis(["GET", refKey]);
    if (!inviter) return res.status(404).json({ ok: false, error: "Referral code not registered yet" });
    if (String(inviter) === me) return res.status(400).json({ ok: false, error: "Self referral is not allowed" });

    const claimKey = "gk:refclaim:" + me;
    const rewardKey = "gk:ref-reward:" + me;

    // The reward marker is the canonical idempotency guard for the bonus.
    // Once inviter state is persisted, never remove this marker just because
    // a secondary leaderboard/audit write fails.
    const claimed = await redis(["SET", claimKey, code, "NX"]);
    if (claimed !== "OK") {
      const existing = await redis(["GET", claimKey]);
      return res.status(200).json({ ok: true, awarded: false, alreadyClaimed: true, referralCode: existing || code });
    }

    const rewardReserved = await redis(["SET", rewardKey, JSON.stringify({ code, inviter: String(inviter), reservedAt: Date.now() }), "NX", "EX", 31536000]);
    if (rewardReserved !== "OK") {
      const existing = await redis(["GET", rewardKey]);
      await redis(["SET", claimKey, code]);
      return res.status(200).json({ ok: true, awarded: false, alreadyClaimed: true, referralCode: existing ? code : code });
    }

    const inviterLockKey = "gk:ref-lock:" + String(inviter);
    const lock = await redis(["SET", inviterLockKey, me, "NX", "EX", "30"]);
    if (lock !== "OK") {
      await redis(["DEL", claimKey]);
      await redis(["DEL", rewardKey]);
      try { await addRiskFlag(me, "REFERRAL_CONCURRENCY", { inviter: hashId(inviter) }); } catch {}
      return res.status(409).json({ ok: false, error: "Referral reward is being processed. Try again shortly." });
    }

    const inviterKey = userKey(inviter);
    let statePersisted = false;

    try {
      const raw = await redis(["GET", inviterKey]);
      const state = safeJson(raw, { points: 0, streak: 0, bestStreak: 0, lastCheckin: null, missions: {} });

      state.points = Number(state.points || 0) + REFERRAL_BONUS;
      state.referrals = Number(state.referrals || 0) + 1;
      state.referralBonus = Number(state.referralBonus || 0) + REFERRAL_BONUS;

      await redis(["SET", inviterKey, JSON.stringify(state)]);
      statePersisted = true;

      // Leaderboard and audit are secondary. A failure here must not roll back
      // the already-persisted reward or allow a retry to grant it twice.
      let leaderboardSynced = true;
      try {
        await redis(["ZADD", "gk:leaderboard", state.points, inviter]);
      } catch {
        leaderboardSynced = false;
        try { await addRiskFlag(inviter, "REFERRAL_LEADERBOARD_SYNC", { referral: hashId(me) }); } catch {}
      }

      try {
        await recordXpLedger(inviter, "referral:" + me, {
          source: "referral",
          bonus: REFERRAL_BONUS,
          referral: hashId(me),
          code
        });
      } catch {}

      return res.status(200).json({
        ok: true,
        awarded: true,
        bonus: REFERRAL_BONUS,
        leaderboardSynced,
        inviter: hashId(inviter)
      });
    } catch (error) {
      if (!statePersisted) {
        await redis(["DEL", claimKey]);
        await redis(["DEL", rewardKey]);
      } else {
        try { await addRiskFlag(inviter, "REFERRAL_STATE_PERSISTED_SECONDARY_FAILURE", { referral: hashId(me) }); } catch {}
      }
      throw error;
    } finally {
      await redis(["DEL", inviterLockKey]);
    }
  } catch (error) {
    return res.status(503).json({ ok: false, error: error.message || "Storage unavailable" });
  }
}
