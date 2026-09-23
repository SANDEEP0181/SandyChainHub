import crypto from "node:crypto";
import { redis, userKey } from "../_lib/goalkeeper.js";

const MAX_AUTH_AGE_SECONDS = 24 * 60 * 60;
const ALLOWED_ORIGIN = "https://sandeep0181.github.io";
const LINK_TOKEN_TTL_SECONDS = 60 * 60;

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");
}

function validateTelegramInitData(initData, botToken) {
  if (!initData || !botToken) return { ok: false, error: "Missing initData or bot token" };
  const params = new URLSearchParams(initData);
  const receivedHash = params.get("hash");
  const authDate = Number(params.get("auth_date"));
  if (!receivedHash || !Number.isFinite(authDate)) return { ok: false, error: "Invalid Telegram initData" };

  const age = Math.floor(Date.now() / 1000) - authDate;
  if (age < -60 || age > MAX_AUTH_AGE_SECONDS) return { ok: false, error: "Telegram auth data expired" };

  params.delete("hash");
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => key + "=" + value)
    .join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const expectedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  if (!/^[0-9a-f]{64}$/i.test(receivedHash)) return { ok: false, error: "Invalid hash" };
  const valid = crypto.timingSafeEqual(Buffer.from(expectedHash, "hex"), Buffer.from(receivedHash, "hex"));
  if (!valid) return { ok: false, error: "Telegram signature check failed" };

  let user = null;
  const rawUser = params.get("user");
  if (rawUser) {
    try { user = JSON.parse(rawUser); }
    catch { return { ok: false, error: "Invalid Telegram user data" }; }
  }
  return { ok: true, user, authDate };
}

function isValidTonAddress(address) {
  if (typeof address !== "string") return false;
  return /^(?:0:[0-9a-fA-F]{64}|EQ[A-Za-z0-9_-]{46}|UQ[A-Za-z0-9_-]{46})$/.test(address.trim());
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

  const walletAddress = typeof body.walletAddress === "string" ? body.walletAddress.trim() : "";
  if (!isValidTonAddress(walletAddress)) {
    return res.status(400).json({ ok: false, error: "Invalid TON wallet address" });
  }

  const telegram = validateTelegramInitData(body.initData, botToken);
  if (!telegram.ok) return res.status(401).json(telegram);
  if (!telegram.user?.id) return res.status(401).json({ ok: false, error: "Telegram user identity missing" });

  try {
    const key = userKey(telegram.user.id);
    const raw = await redis(["GET", key]);
    const state = raw ? JSON.parse(raw) : { points: 0, streak: 0, bestStreak: 0, lastCheckin: null, missions: {} };
    state.missions = state.missions || {};
    if (!state.missions.identity) {
      state.points = Number(state.points || 0) + 15;
      state.missions.identity = { completedAt: new Date().toISOString(), points: 15 };
    }
    state.walletAddress = walletAddress;
    await redis(["SET", key, JSON.stringify(state)]);
    await redis(["ZADD", "gk:leaderboard", state.points, String(telegram.user.id)]);
  } catch (error) {
    return res.status(503).json({ ok: false, error: error.message || "Storage unavailable" });
  }

  return res.status(200).json({
    ok: true,
    status: "linked",
    walletAddress,
    telegramUserId: telegram.user.id
  });
}
