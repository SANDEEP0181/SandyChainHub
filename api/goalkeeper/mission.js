import crypto from "node:crypto";
import {
  cors, validateTelegramInitData, redis, userKey, missionPoints,
  validMission, todayUtc
} from "../_lib/goalkeeper.js";

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

  const missionId = typeof body.missionId === "string" ? body.missionId.trim() : "";
  if (!validMission(missionId)) {
    return res.status(400).json({ ok: false, error: "Invalid mission" });
  }

  try {
    const key = userKey(auth.user.id);
    const raw = await redis(["GET", key]);
    const state = raw ? JSON.parse(raw) : {
      points: 0,
      streak: 0,
      bestStreak: 0,
      lastCheckin: null,
      missions: {}
    };

    state.missions = state.missions || {};

    if (missionId === "checkin") {
      const today = todayUtc();
      if (state.missions.checkin?.date === today) {
        return res.status(200).json({ ok: true, awarded: false, points: state.points, state });
      }
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      state.streak = state.lastCheckin === yesterday ? Number(state.streak || 0) + 1 : 1;
      state.bestStreak = Math.max(Number(state.bestStreak || 0), state.streak);
      state.lastCheckin = today;
    } else if (missionId === "spin") {
      const today = todayUtc();
      if (state.missions.spin?.date === today) {
        return res.status(200).json({ ok: true, awarded: false, points: state.points, state });
      }
    } else if (state.missions[missionId]) {
      return res.status(200).json({ ok: true, awarded: false, points: state.points, state });
    }

    if (missionId === "checkin") {
      const today = todayUtc();
      if (state.lastCheckin === today) {
        return res.status(200).json({ ok: true, awarded: false, points: state.points, state });
      }
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      state.streak = state.lastCheckin === yesterday ? Number(state.streak || 0) + 1 : 1;
      state.bestStreak = Math.max(Number(state.bestStreak || 0), state.streak);
      state.lastCheckin = today;
    }

    const points = missionId === "spin" ? [5, 10, 15, 25, 50][crypto.randomInt(0, 5)] : missionPoints(missionId);
    state.points = Number(state.points || 0) + points;
    state.missions[missionId] = { completedAt: new Date().toISOString(), points, ...(missionId === "checkin" || missionId === "spin" ? { date: todayUtc() } : {}) };

    await redis(["SET", key, JSON.stringify(state)]);
    await redis(["ZADD", "gk:leaderboard", state.points, String(auth.user.id)]);

    return res.status(200).json({ ok: true, awarded: true, points, state });
  } catch (error) {
    return res.status(503).json({ ok: false, error: error.message || "Storage unavailable" });
  }
}
