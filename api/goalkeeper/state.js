import { cors, validateTelegramInitData, redis, userKey, publicUserId, todayUtc, rateLimit, addRiskFlag } from "../_lib/goalkeeper.js";

export default async function handler(req, res) {
  cors(res);
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

  const auth = validateTelegramInitData(body.initData, botToken);
  if (!auth.ok) return res.status(401).json(auth);

  try {
    const limiter = await rateLimit(auth.user.id, "state", 30, 60);
    if (!limiter.ok) {
      await addRiskFlag(auth.user.id, "STATE_RATE_LIMIT", { limit: 30, windowSeconds: 60 }).catch(() => {});
      return res.status(429).json({ ok: false, error: "Too many requests", retryable: true });
    }
    const raw = await redis(["GET", userKey(auth.user.id)]);
    const state = raw ? JSON.parse(raw) : {
      points: 0,
      streak: 0,
      bestStreak: 0,
      lastCheckin: null,
      missions: {}
    };

    return res.status(200).json({
      ok: true,
      user: auth.user,
      goalkeeperUserId: publicUserId(auth.user.id, botToken),
      today: todayUtc(),
      state
    });
  } catch (error) {
    return res.status(503).json({ ok: false, error: error.message || "Storage unavailable" });
  }
}
