import crypto from "node:crypto";
import { cors, validateTelegramInitData, redis, userKey, rateLimit, addRiskFlag } from "../_lib/goalkeeper.js";

const CODE_RE = /^GK-[A-Z0-9]{6}$/;
const REFERRAL_BONUS = 20;

function safeJson(raw, fallback) {
  try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
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
    const claimed = await redis(["SET", claimKey, code, "NX"]);
    if (claimed !== "OK") {
      const existing = await redis(["GET", claimKey]);
      return res.status(200).json({ ok: true, awarded: false, alreadyClaimed: true, referralCode: existing || code });
    }

    const inviterLockKey = "gk:ref-lock:" + String(inviter);
    const lock = await redis(["SET", inviterLockKey, me, "NX", "EX", "30"]);
    if (lock !== "OK") {
      await redis(["DEL", claimKey]);
      try { await addRiskFlag(me, "REFERRAL_CONCURRENCY", { inviter: crypto.createHash("sha256").update(String(inviter)).digest("hex").slice(0, 8) }); } catch {}
      return res.status(409).json({ ok: false, error: "Referral reward is being processed. Try again shortly." });
    }

    const inviterKey = userKey(inviter);
    const raw = await redis(["GET", inviterKey]);
    const state = safeJson(raw, { points: 0, streak: 0, bestStreak: 0, lastCheckin: null, missions: {} });
    state.points = Number(state.points || 0) + REFERRAL_BONUS;
    state.referrals = Number(state.referrals || 0) + 1;
    state.referralBonus = Number(state.referralBonus || 0) + REFERRAL_BONUS;
    try {
      await redis(["SET", inviterKey, JSON.stringify(state)]);
      await redis(["ZADD", "gk:leaderboard", state.points, inviter]);
      return res.status(200).json({ ok: true, awarded: true, bonus: REFERRAL_BONUS, inviter: crypto.createHash("sha256").update(inviter).digest("hex").slice(0, 8).toUpperCase() });
    } catch (error) {
      await redis(["DEL", claimKey]);
      throw error;
    } finally {
      await redis(["DEL", inviterLockKey]);
    }
  } catch (error) {
    return res.status(503).json({ ok: false, error: error.message || "Storage unavailable" });
  }
}
