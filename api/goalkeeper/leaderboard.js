import { cors, redis } from "../_lib/goalkeeper.js";

export default async function handler(req, res) {
  cors(res, "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ ok: false, error: "Method not allowed" });

  try {
    const raw = await redis(["ZREVRANGE", "gk:leaderboard", "0", "19", "WITHSCORES"]);
    const entries = [];
    for (let i = 0; i < raw.length; i += 2) {
      entries.push({
        telegramUserId: String(raw[i]),
        points: Number(raw[i + 1])
      });
    }
    return res.status(200).json({ ok: true, entries });
  } catch (error) {
    return res.status(503).json({ ok: false, error: error.message || "Storage unavailable" });
  }
}
