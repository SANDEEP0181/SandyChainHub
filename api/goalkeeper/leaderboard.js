import { cors, redis, publicUserId } from "../_lib/goalkeeper.js";

export default async function handler(req, res) {
  cors(res, "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "Method not allowed" });

  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) return res.status(500).json({ ok: false, error: "Server is not configured" });
    const raw = await redis(["ZREVRANGE", "gk:leaderboard", "0", "19", "WITHSCORES"]);
    const entries = [];
    for (let i = 0; i < raw.length; i += 2) {
      entries.push({
        goalkeeperUserId: publicUserId(String(raw[i]), botToken),
        points: Number(raw[i + 1])
      });
    }
    return res.status(200).json({ ok: true, entries });
  } catch (error) {
    return res.status(503).json({ ok: false, error: error.message || "Storage unavailable" });
  }
}
