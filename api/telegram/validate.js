import crypto from "node:crypto";

const MAX_AUTH_AGE_SECONDS = 24 * 60 * 60;
const ALLOWED_ORIGIN = "https://sandeep0181.github.io";

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
  const dataCheckString = [...params.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => key + "=" + value).join("\n");
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

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return res.status(500).json({ ok: false, error: "Server is not configured" });
  const initData = typeof req.body === "string" ? req.body : req.body?.initData;
  const result = validateTelegramInitData(initData, botToken);
  if (!result.ok) return res.status(401).json(result);
  return res.status(200).json({ ok: true, user: result.user, authDate: result.authDate });
}
