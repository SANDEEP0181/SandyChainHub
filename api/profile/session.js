import crypto from "node:crypto";

const MAX_AUTH_AGE_SECONDS = 24 * 60 * 60;
const ALLOWED_ORIGIN = "https://sandeep0181.github.io";

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");
}

function validate(initData, botToken) {
  if (!initData || !botToken) return { ok: false, error: "Missing Telegram session" };
  const p = new URLSearchParams(initData);
  const hash = p.get("hash");
  const authDate = Number(p.get("auth_date"));
  if (!hash || !Number.isFinite(authDate)) return { ok: false, error: "Invalid Telegram session" };
  const age = Math.floor(Date.now()/1000) - authDate;
  if (age < -60 || age > MAX_AUTH_AGE_SECONDS) return { ok: false, error: "Telegram auth data expired" };
  p.delete("hash");
  const check = [...p.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>k+"="+v).join("\n");
  const secret = crypto.createHmac("sha256","WebAppData").update(botToken).digest();
  const expected = crypto.createHmac("sha256",secret).update(check).digest("hex");
  if (!/^[0-9a-f]{64}$/i.test(hash)) return { ok:false,error:"Invalid hash" };
  if (!crypto.timingSafeEqual(Buffer.from(expected,"hex"),Buffer.from(hash,"hex"))) return { ok:false,error:"Telegram signature check failed" };
  let user=null;
  try { user = p.get("user") ? JSON.parse(p.get("user")) : null; } catch { return {ok:false,error:"Invalid Telegram user data"}; }
  return {ok:true,user,authDate};
}

export default async function handler(req,res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ok:false,error:"Method not allowed"});
  const token=process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return res.status(500).json({ok:false,error:"Server is not configured"});
  let body;
  try { body = typeof req.body==="string" ? JSON.parse(req.body||"{}") : (req.body||{}); } catch { return res.status(400).json({ok:false,error:"Invalid JSON body"}); }
  const result=validate(body.initData,token);
  if (!result.ok) return res.status(401).json(result);
  if (!result.user?.id) return res.status(401).json({ok:false,error:"Telegram user identity missing"});
  const publicId=crypto.createHmac("sha256",token).update("goalkeeper-user:"+String(result.user.id)).digest("hex").slice(0,12).toUpperCase();
  return res.status(200).json({ok:true,user:result.user,goalkeeperUserId:"GK-"+publicId,authDate:result.authDate});
}
