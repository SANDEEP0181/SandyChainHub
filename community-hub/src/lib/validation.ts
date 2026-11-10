import { z } from "zod";

const safePublicText = (value: string) => !/(https?:\\/\\/|www\\.|[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}|0x[a-fA-F0-9]{40})/i.test(value) && !/(?:\\+?\\d[\\d\\s().-]{8,}\\d)/.test(value);

export const createPostSchema = z.object({
  title: z.string().trim().max(120).refine(safePublicText, "Do not post links or private contact details.").optional(),
  body: z.string().trim().min(5).max(5000).refine(safePublicText, "Do not post links or private contact details."),
  category: z.enum(["Community", "Learning", "Builders", "Questions"]).default("Community")
});

export const createCommentSchema = z.object({
  body: z.string().trim().min(2).max(1500).refine(safePublicText, "Do not post links or private contact details.")
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
