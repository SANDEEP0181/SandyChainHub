import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().trim().max(120).optional(),
  body: z.string().trim().min(5).max(5000),
  category: z.enum(["Community", "Learning", "Builders", "Questions"]).default("Community")
});

export const createCommentSchema = z.object({
  body: z.string().trim().min(2).max(1500)
});

export const createReportSchema = z.object({
  postId: z.string().min(1),
  reason: z.enum(["Spam", "Harassment", "Misleading", "Inappropriate", "Other"]),
  details: z.string().trim().max(1000).optional()
});

export const createInquirySchema = z.object({
  listingId: z.string().min(1),
  message: z.string().trim().min(5).max(1500)
});

export const progressSchema = z.object({
  lessonId: z.string().min(1),
  completed: z.boolean()
});

export const reportStatusSchema = z.object({
  status: z.enum(["REVIEWING", "RESOLVED", "DISMISSED"])
});

export const moderatePostSchema = z.object({
  status: z.enum(["PUBLISHED", "HIDDEN", "REMOVED"])
});
