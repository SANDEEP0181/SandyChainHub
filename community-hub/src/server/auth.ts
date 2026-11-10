import type { NextFunction, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { prisma } from "./prisma";

declare global {
  namespace Express {
    interface Request {
      communityUser?: { id: string; externalId: string; role: string; displayName: string };
    }
  }
}

let jwks: ReturnType<typeof createRemoteJWKSet> | undefined;

function getJwks() {
  const url = process.env.INTERLINK_JWKS_URL;
  if (!url) return undefined;
  if (!jwks) jwks = createRemoteJWKSet(new URL(url));
  return jwks;
}

export async function requireIdentity(req: Request, res: Response, next: NextFunction) {
  try {
    // Local-only test identity. This is deliberately impossible in production.
    if (process.env.NODE_ENV !== "production" && process.env.DEV_AUTH_ENABLED === "true") {
      const externalId = req.header("x-dev-user-id");
      if (externalId) {
        const displayName = req.header("x-dev-user-name")?.slice(0, 60) || "Local Preview User";
        const user = await prisma.user.upsert({
          where: { externalId },
          update: { displayName },
          create: { externalId, displayName }
        });
        req.communityUser = user;
        return next();
      }
    }

    const keySet = getJwks();
    const issuer = process.env.INTERLINK_ISSUER;
    const audience = process.env.INTERLINK_AUDIENCE;
    if (!keySet || !issuer || !audience) {
      return res.status(503).json({ error: "InterLink identity verification is not configured. Community write actions are temporarily unavailable." });
    }

    const header = req.header("authorization");
    if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "Sign-in required." });
    const token = header.slice(7);
    const { payload } = await jwtVerify(token, keySet, { issuer, audience });
    if (typeof payload.sub !== "string" || !payload.sub) return res.status(401).json({ error: "Invalid identity token." });

    const displayName = typeof payload.name === "string" ? payload.name.slice(0, 60) : "InterLink Member";
    const user = await prisma.user.upsert({
      where: { externalId: payload.sub },
      update: { displayName },
      create: { externalId: payload.sub, displayName }
    });
    req.communityUser = user;
    return next();
  } catch {
    return res.status(401).json({ error: "Identity verification failed." });
  }
}

export function requireAdminToken(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.ADMIN_API_TOKEN;
  const supplied = req.header("x-admin-token");
  if (!expected || !supplied || supplied.length !== expected.length) {
    return res.status(401).json({ error: "Admin authorization required." });
  }
  let same = 0;
  for (let i = 0; i < expected.length; i++) same |= expected.charCodeAt(i) ^ supplied.charCodeAt(i);
  if (same !== 0) return res.status(401).json({ error: "Admin authorization required." });
  return next();
}
