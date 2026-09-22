import {
  cors, validateTelegramInitData, redis, userKey, todayUtc
} from "../_lib/goalkeeper.js";

const EVENT_START = "2026-09-23T00:00:00Z";
const EVENT_END = "2026-09-30T00:00:00Z";
const EVENT_DAYS = 7;
const MAX_XP = 120;

function safeJson(raw, fallback) {
  try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
}

function eventDayIndex(date) {
  const start = Date.parse(EVENT_START);
  const t = Date.parse(date + "T00:00:00Z");
  return Math.floor((t - start) / 86400000);
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

  const action = typeof body.action === "string" ? body.action.trim().toLowerCase() : "";
  const allowed = new Set(["join", "daily", "core", "spin"]);
  if (!allowed.has(action)) return res.status(400).json({ ok: false, error: "Invalid event action" });

  const now = Date.now();
  if (now < Date.parse(EVENT_START) || now >= Date.parse(EVENT_END)) {
    return res.status(400).json({ ok: false, error: "Genesis Event is not active" });
  }

  try {
    const key = userKey(auth.user.id);
    const raw = await redis(["GET", key]);
    const state = safeJson(raw, {
      points: 0, streak: 0, bestStreak: 0, lastCheckin: null, missions: {}
    });
    state.missions = state.missions || {};
    state.event = state.event || { joined: false, daily: [], bonuses: {} };
    state.event.daily = Array.isArray(state.event.daily) ? state.event.daily : [];
    state.event.bonuses = state.event.bonuses || {};

    const today = todayUtc();
    const dayIndex = eventDayIndex(today);
    if (dayIndex < 0 || dayIndex >= EVENT_DAYS) {
      return res.status(400).json({ ok: false, error: "Invalid event day" });
    }

    let xp = 0;
    let awarded = false;

    if (action === "join") {
      if (state.event.joined) {
        return res.status(200).json({ ok: true, awarded: false, event: state.event, state });
      }
      state.event.joined = true;
      xp = 10;
      awarded = true;
    }

    if (action === "daily") {
      if (!state.event.joined) return res.status(400).json({ ok: false, error: "Join the event first" });
      if (state.event.daily.includes(today)) {
        return res.status(200).json({ ok: true, awarded: false, event: state.event, state });
      }
      state.event.daily.push(today);
      state.event.daily = state.event.daily.slice(-EVENT_DAYS);
      xp = 10;
      awarded = true;
    }

    if (action === "core") {
      if (!state.event.joined) return res.status(400).json({ ok: false, error: "Join the event first" });
      const coreDone = ["open", "connect", "identity"].filter(id => state.missions[id]).length;
      if (coreDone < 3) return res.status(400).json({ ok: false, error: "Complete 3 core missions first" });
      if (state.event.bonuses.core) return res.status(200).json({ ok: true, awarded: false, event: state.event, state });
      state.event.bonuses.core = new Date().toISOString();
      xp = 25;
      awarded = true;
    }

    if (action === "spin") {
      if (!state.event.joined) return res.status(400).json({ ok: false, error: "Join the event first" });
      if (state.missions.spin?.date !== today) {
        return res.status(400).json({ ok: false, error: "Complete today's server-verified spin first" });
      }
      if (state.event.bonuses["spin:" + today]) {
        return res.status(200).json({ ok: true, awarded: false, event: state.event, state });
      }
      state.event.bonuses["spin:" + today] = new Date().toISOString();
      xp = 15;
      awarded = true;
    }

    if (awarded) {
      const currentEventXp = Number(state.event.xp || 0);
      state.event.xp = Math.min(MAX_XP, currentEventXp + xp);
      state.points = Number(state.points || 0) + xp;
      await redis(["SET", key, JSON.stringify(state)]);
      await redis(["ZADD", "gk:leaderboard", state.points, String(auth.user.id)]);
    }

    return res.status(200).json({
      ok: true,
      awarded,
      xp: awarded ? xp : 0,
      event: state.event,
      state
    });
  } catch (error) {
    return res.status(503).json({ ok: false, error: error.message || "Storage unavailable" });
  }
}
