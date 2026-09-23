import crypto from "node:crypto";

export const ALLOWED_ORIGIN = "https://sandeep0181.github.io";
export const MAX_AUTH_AGE_SECONDS = 60 * 60;
export const TON_PROOF_TTL_SECONDS = 15 * 60;

export function cors(res, methods = "POST, OPTIONS") {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", methods);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");
}

export function validateTelegramInitData(initData, botToken) {
  if (!initData || !botToken) return { ok: false, error: "Missing Telegram session" };
  const params = new URLSearchParams(initData);
  const receivedHash = params.get("hash");
  const authDate = Number(params.get("auth_date"));
  if (!receivedHash || !Number.isFinite(authDate)) return { ok: false, error: "Invalid Telegram session" };

  const age = Math.floor(Date.now() / 1000) - authDate;
  if (age < -60 || age > MAX_AUTH_AGE_SECONDS) {
    return { ok: false, error: "Telegram auth data expired" };
  }

  params.delete("hash");
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => key + "=" + value)
    .join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const expectedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  if (!/^[0-9a-f]{64}$/i.test(receivedHash)) return { ok: false, error: "Invalid hash" };
  if (!crypto.timingSafeEqual(Buffer.from(expectedHash, "hex"), Buffer.from(receivedHash, "hex"))) {
    return { ok: false, error: "Telegram signature check failed" };
  }

  let user = null;
  try {
    user = params.get("user") ? JSON.parse(params.get("user")) : null;
  } catch {
    return { ok: false, error: "Invalid Telegram user data" };
  }

  if (!user?.id) return { ok: false, error: "Telegram user identity missing" };
  return { ok: true, user, authDate };
}

export async function redis(command) {
  // Vercel's Upstash integration may expose either the UPSTASH_* names
  // or the KV_* names. Support both without requiring secret duplication.
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error("Goalkeeper storage is not configured");

  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    body: JSON.stringify(command)
  });

  if (!response.ok) throw new Error("Goalkeeper storage request failed");
  const data = await response.json();
  if (data.error) throw new Error(String(data.error));
  return data.result;
}

export function userKey(telegramId) {
  return "gk:user:" + String(telegramId);
}

export function publicUserId(telegramId, botToken) {
  return "GK-" + crypto.createHmac("sha256", botToken)
    .update("goalkeeper-user:" + String(telegramId))
    .digest("hex").slice(0, 12).toUpperCase();
}

export function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

export function missionPoints(missionId) {
  const points = {
    open: 5,
    connect: 10,
    identity: 15,
    checkin: 10,
    spin: 0
  };
  return points[missionId] ?? 0;
}

export function validMission(missionId) {
  return Object.prototype.hasOwnProperty.call({
    open: true,
    connect: true,
    identity: true,
    checkin: true,
    spin: true
  }, missionId);
}


export async function recordXpLedger(telegramId, eventId, entry) {
  const key = "gk:xp-ledger:" + String(telegramId) + ":" + String(eventId);
  const payload = JSON.stringify({
    userId: String(telegramId),
    eventId: String(eventId),
    ...entry,
    recordedAt: new Date().toISOString()
  });
  const created = await redis(["SET", key, payload, "NX", "EX", "31536000"]);
  return created === "OK";
}

export async function addRiskFlag(telegramId, flag, details = {}) {
  const key = userKey(telegramId);
  const raw = await redis(["GET", key]);
  const state = raw ? JSON.parse(raw) : {
    points: 0, streak: 0, bestStreak: 0, lastCheckin: null, missions: {}
  };
  const flags = Array.isArray(state.riskFlags) ? state.riskFlags : [];
  if (!flags.some(x => x?.code === flag)) {
    flags.push({
      code: String(flag),
      details,
      detectedAt: new Date().toISOString()
    });
    state.riskFlags = flags.slice(-20);
    await redis(["SET", key, JSON.stringify(state)]);
  }
  return state.riskFlags || [];
}

export async function rateLimit(telegramId, action, limit = 20, windowSeconds = 60) {
  const key = "gk:rate:" + String(telegramId) + ":" + action;
  const created = await redis(["SET", key, "1", "NX", "EX", String(windowSeconds)]);
  if (created === "OK") return { ok: true, remaining: limit - 1 };
  const count = Number(await redis(["INCR", key]));
  if (count > limit) return { ok: false, remaining: 0 };
  return { ok: true, remaining: Math.max(0, limit - count) };
}
