import crypto from "node:crypto";
import { redis, validateTelegramInitData, TON_PROOF_TTL_SECONDS } from "../_lib/goalkeeper.js";

const ALLOWED_ORIGIN = "https://sandeep0181.github.io";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return res.status(500).json({ ok: false, error: "Server is not configured" });

  let body;
  try { body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {}); }
  catch { return res.status(400).json({ ok: false, error: "Invalid JSON body" }); }

  const auth = validateTelegramInitData(body.initData, botToken);
  if (!auth.ok) return res.status(401).json(auth);

  try {
    const payload = crypto.randomBytes(32).toString("base64url");
    await redis(["SET", "gk:tonproof:" + String(auth.user.id), payload, "EX", TON_PROOF_TTL_SECONDS]);
    return res.status(200).json({ ok: true, payload, expiresIn: TON_PROOF_TTL_SECONDS });
  } catch (error) {
    return res.status(503).json({ ok: false, error: error.message || "Storage unavailable" });
  }
}
