import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { prisma } from "./prisma";
import { requireAdminToken, requireIdentity } from "./auth";
import {
  createCommentSchema, createPostSchema,
  createReportSchema, progressSchema, reportStatusSchema, moderatePostSchema
} from "../lib/validation";

export const app = express();
app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",").map((item) => item.trim()).filter(Boolean) ?? [],
  methods: ["GET", "POST", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Admin-Token"]
}));
app.use(express.json({ limit: "32kb" }));
app.use(rateLimit({ windowMs: 60_000, limit: 90, standardHeaders: true, legacyHeaders: false }));

type AsyncHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<unknown>;
const asyncRoute = (fn: AsyncHandler): express.RequestHandler =>
  (req, res, next) => { void fn(req, res, next).catch(next); };

app.get("/api/health", asyncRoute(async (_req, res) => {
  let databaseConnected = false;
  try { await prisma.$queryRaw`SELECT 1`; databaseConnected = true; } catch { databaseConnected = false; }
  res.status(databaseConnected ? 200 : 503).json({
    status: databaseConnected ? "ok" : "degraded",
    service: "interlink-community-hub",
    identityConfigured: Boolean(process.env.INTERLINK_JWKS_URL && process.env.INTERLINK_ISSUER && process.env.INTERLINK_AUDIENCE),
    databaseConnected
  });
}));

app.get("/api/posts", asyncRoute(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(30, Math.max(1, Number(req.query.limit) || 10));
  const [items, total] = await Promise.all([
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        author: { select: { displayName: true } },
        _count: { select: { comments: true, likes: true } }
      }
    }),
    prisma.post.count({ where: { status: "PUBLISHED" } })
  ]);
  res.json({ items, page, limit, total });
}));

app.post("/api/posts", requireIdentity, asyncRoute(async (req, res) => {
  const input = createPostSchema.parse(req.body);
  const post = await prisma.post.create({
    data: { ...input, authorId: req.communityUser!.id },
    include: { author: { select: { displayName: true } }, _count: { select: { comments: true, likes: true } } }
  });
  res.status(201).json({ item: post });
}));

app.get("/api/posts/:postId/comments", asyncRoute(async (req, res) => {
  const items = await prisma.comment.findMany({
    where: { postId: req.params.postId, status: "PUBLISHED" },
    orderBy: { createdAt: "asc" },
    take: 100,
    include: { author: { select: { displayName: true } } }
  });
  res.json({ items });
}));

app.post("/api/posts/:postId/comments", requireIdentity, asyncRoute(async (req, res) => {
  const input = createCommentSchema.parse(req.body);
  const post = await prisma.post.findFirst({ where: { id: req.params.postId, status: "PUBLISHED" } });
  if (!post) return res.status(404).json({ error: "Post not found." });
  const item = await prisma.comment.create({
    data: { ...input, postId: post.id, authorId: req.communityUser!.id },
    include: { author: { select: { displayName: true } } }
  });
  res.status(201).json({ item });
}));

app.post("/api/posts/:postId/likes", requireIdentity, asyncRoute(async (req, res) => {
  const postId = req.params.postId;
  const userId = req.communityUser!.id;
  const post = await prisma.post.findFirst({ where: { id: postId, status: "PUBLISHED" } });
  if (!post) return res.status(404).json({ error: "Post not found." });
  const existing = await prisma.postLike.findUnique({ where: { postId_userId: { postId, userId } } });
  if (existing) await prisma.postLike.delete({ where: { id: existing.id } });
  else await prisma.postLike.create({ data: { postId, userId } });
  const likes = await prisma.postLike.count({ where: { postId } });
  res.json({ liked: !existing, likes });
}));

app.post("/api/reports", requireIdentity, asyncRoute(async (req, res) => {
  const input = createReportSchema.parse(req.body);
  const post = await prisma.post.findFirst({ where: { id: input.postId, status: "PUBLISHED" } });
  if (!post) return res.status(404).json({ error: "Post not found." });
  const item = await prisma.report.create({
    data: { ...input, reporterId: req.communityUser!.id }
  });
  res.status(201).json({ item: { id: item.id, status: item.status } });
}));

app.get("/api/listings", asyncRoute(async (req, res) => {
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const items = await prisma.listing.findMany({
    where: { status: "PUBLISHED", ...(category ? { category } : {}) },
    orderBy: { createdAt: "desc" },
    take: 50
  });
  res.json({ items });
}));

app.post("/api/inquiries", (_req, res) => res.status(403).json({ error: "Direct contact and marketplace enquiry features are not available in this release." }));

app.get("/api/courses", asyncRoute(async (_req, res) => {
  const items = await prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { lessons: true } } }
  });
  res.json({ items });
}));

app.get("/api/courses/:courseId/lessons", asyncRoute(async (req, res) => {
  const items = await prisma.lesson.findMany({
    where: { courseId: req.params.courseId, course: { published: true } },
    orderBy: { order: "asc" },
    select: { id: true, order: true, titleEn: true, titleHi: true, bodyEn: true, bodyHi: true, durationMin: true }
  });
  res.json({ items });
}));

app.post("/api/learning/progress", requireIdentity, asyncRoute(async (req, res) => {
  const input = progressSchema.parse(req.body);
  const lesson = await prisma.lesson.findFirst({ where: { id: input.lessonId, course: { published: true } } });
  if (!lesson) return res.status(404).json({ error: "Lesson not found." });
  if (input.completed) {
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: req.communityUser!.id, lessonId: input.lessonId } },
      update: {},
      create: { userId: req.communityUser!.id, lessonId: input.lessonId }
    });
  } else {
    await prisma.lessonProgress.deleteMany({ where: { userId: req.communityUser!.id, lessonId: input.lessonId } });
  }
  res.json({ completed: input.completed });
}));

app.get("/api/admin/reports", requireAdminToken, asyncRoute(async (_req, res) => {
  const items = await prisma.report.findMany({
    where: { status: { in: ["OPEN", "REVIEWING"] } },
    orderBy: { createdAt: "asc" },
    take: 100,
    include: { reporter: { select: { displayName: true } }, post: { select: { id: true, body: true, status: true } } }
  });
  res.json({ items });
}));

app.patch("/api/admin/posts/:postId", requireAdminToken, asyncRoute(async (req, res) => {
  const input = moderatePostSchema.parse(req.body);
  const item = await prisma.post.update({ where: { id: req.params.postId }, data: { status: input.status } });
  res.json({ item: { id: item.id, status: item.status } });
}));

app.patch("/api/admin/reports/:reportId", requireAdminToken, asyncRoute(async (req, res) => {
  const input = reportStatusSchema.parse(req.body);
  const item = await prisma.report.update({
    where: { id: req.params.reportId },
    data: { status: input.status, reviewedAt: new Date() }
  });
  res.json({ item: { id: item.id, status: item.status } });
}));

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof z.ZodError) return res.status(400).json({ error: "Invalid request.", issues: err.issues });
  if (err instanceof Error && "code" in err && err.code === "P2002") return res.status(409).json({ error: "This action already exists." });
  if (process.env.NODE_ENV !== "production") console.error(err);
  return res.status(500).json({ error: "Something went wrong. Please try again." });
});
