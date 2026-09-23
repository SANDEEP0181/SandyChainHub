import crypto from "node:crypto";
import {
  cors, validateTelegramInitData, redis, userKey, missionPoints,
  validMission, todayUtc, rateLimit, recordXpLedger, addRiskFlag
} from "../_lib/goalkeeper.js";

function defaultState() {
  return {
    points: 0,
    streak: 0,
    bestStreak: 0,
    lastCheckin: null,
    missions: {}
  };
}

function parseState(raw) {
  try { return raw ? JSON.parse(raw) : defaultState(); }
  catch { return defaultState(); }
}

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

  const limiter = await rateLimit(auth.user.id, "mission", 12, 60);
  if (!limiter.ok) {
    try { await addRiskFlag(auth.user.id, "MISSION_RATE_LIMIT", { windowSeconds: 60, limit: 12 }); } catch {}
    return res.status(429).json({ ok: false, error: "Too many mission requests. Try again shortly." });
  }

  const missionId = typeof body.missionId === "string" ? body.missionId.trim() : "";
  if (!validMission(missionId)) {
    return res.status(400).json({ ok: false, error: "Invalid mission" });
  }

  try {
    const key = userKey(auth.user.id);
    const today = todayUtc();
    const eventId = missionId === "checkin" || missionId === "spin"
      ? missionId + ":" + today
      : missionId + ":once";
    const requestKey = "gk:mission-lock:" + String(auth.user.id) + ":" + eventId;
    const lock = await redis(["SET", requestKey, "1", "NX", "EX", "30"]);
    if (lock !== "OK") {
      return res.status(200).json({ ok: true, awarded: false, duplicateRequest: true });
    }

    const raw = await redis(["GET", key]);
    const state = parseState(raw);
    state.missions = state.missions || {};

    if (missionId === "identity" && !state.missions.identity) {
      return res.status(400).json({ ok: false, error: "Identity must be linked through the identity endpoint first" });
    }

    if (missionId === "checkin" && state.missions.checkin?.date === today) {
      return res.status(200).json({ ok: true, awarded: false, points: state.points, state });
    }

    if (missionId === "spin" && state.missions.spin?.date === today) {
      return res.status(200).json({ ok: true, awarded: false, points: state.points, state });
    }

    if (missionId !== "checkin" && missionId !== "spin" && state.missions[missionId]) {
      return res.status(200).json({ ok: true, awarded: false, points: state.points, state });
    }

    if (missionId === "checkin") {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      state.streak = state.lastCheckin === yesterday ? Number(state.streak || 0) + 1 : 1;
      state.bestStreak = Math.max(Number(state.bestStreak || 0), state.streak);
      state.lastCheckin = today;
    }

    const points = missionId === "spin"
      ? [5, 10, 15, 25, 50][crypto.randomInt(0, 5)]
      : missionPoints(missionId);

    state.points = Number(state.points || 0) + points;
    state.missions[missionId] = {
      completedAt: new Date().toISOString(),
      points,
      ...(missionId === "checkin" || missionId === "spin" ? { date: today } : {})
    };

    await redis(["SET", key, JSON.stringify(state)]);
    await redis(["ZADD", "gk:leaderboard", state.points, String(auth.user.id)]);

    try {
      await recordXpLedger(auth.user.id, eventId, {
        type: "mission",
        missionId,
        points,
        source: "goalkeeper-mission"
      });
    } catch {
      // The user state remains canonical; ledger recording is best-effort audit data.
    }

    return res.status(200).json({ ok: true, awarded: true, points, state });
  } catch (error) {
    return res.status(503).json({ ok: false, error: error.message || "Storage unavailable" });
  }
}
