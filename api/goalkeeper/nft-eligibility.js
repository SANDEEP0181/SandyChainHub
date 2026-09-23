import {
  cors, validateTelegramInitData, redis, userKey, rateLimit
} from "../_lib/goalkeeper.js";

const REQUIRED_STREAK = 30;

function safeState(raw) {
  try {
    return raw ? JSON.parse(raw) : {
      points: 0,
      streak: 0,
      bestStreak: 0,
      lastCheckin: null,
      missions: {}
    };
  } catch {
    return {
      points: 0,
      streak: 0,
      bestStreak: 0,
      lastCheckin: null,
      missions: {}
    };
  }
}

export default async function handler(req, res) {
  cors(res, "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return res.status(500).json({ ok: false, error: "Server is not configured" });
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  } catch {
    return res.status(400).json({ ok: false, error: "Invalid JSON body" });
  }

  const auth = validateTelegramInitData(body.initData, botToken);
  if (!auth.ok) return res.status(401).json(auth);

  const limiter = await rateLimit(auth.user.id, "nft-eligibility", 10, 60);
  if (!limiter.ok) {
    return res.status(429).json({
      ok: false,
      error: "Too many eligibility checks. Try again shortly."
    });
  }

  try {
    const raw = await redis(["GET", userKey(auth.user.id)]);
    const state = safeState(raw);
    const streak = Number(state.streak || 0);
    const bestStreak = Number(state.bestStreak || 0);
    const walletVerified = state.walletProofVerified === true;
    const riskFlags = Array.isArray(state.riskFlags) ? state.riskFlags : [];
    const activeRiskFlags = riskFlags.filter(x => x && !x.resolvedAt);

    const reasons = [];
    if (streak < REQUIRED_STREAK) reasons.push("STREAK_30_REQUIRED");
    if (!walletVerified) reasons.push("TON_WALLET_PROOF_REQUIRED");
    if (activeRiskFlags.length) reasons.push("SECURITY_REVIEW_REQUIRED");

    return res.status(200).json({
      ok: true,
      eligible: reasons.length === 0,
      nft: {
        status: "NOT_MINTED",
        claimEnabled: false
      },
      requirements: {
        requiredStreak: REQUIRED_STREAK,
        currentStreak: streak,
        bestStreak,
        walletProofVerified: walletVerified,
        securityReviewRequired: activeRiskFlags.length > 0
      },
      reasons,
      riskFlags: activeRiskFlags.map(x => ({
        code: x.code,
        detectedAt: x.detectedAt
      }))
    });
  } catch (error) {
    return res.status(503).json({
      ok: false,
      error: error.message || "Storage unavailable"
    });
  }
}
