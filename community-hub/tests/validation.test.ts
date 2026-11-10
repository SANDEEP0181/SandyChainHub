import test from "node:test";
import assert from "node:assert/strict";
import {
  createCommentSchema, createInquirySchema, createPostSchema,
  createReportSchema, progressSchema, reportStatusSchema
} from "../src/lib/validation";

test("post schema accepts a safe, bounded community post", () => {
  const parsed = createPostSchema.parse({ body: "A useful community question.", category: "Questions" });
  assert.equal(parsed.category, "Questions");
});

test("post schema rejects empty or oversized content", () => {
  assert.equal(createPostSchema.safeParse({ body: "" }).success, false);
  assert.equal(createPostSchema.safeParse({ body: "x".repeat(5001) }).success, false);
});

test("public post and comment content rejects contact links and details", () => {
  assert.equal(createPostSchema.safeParse({ body: "Visit https://example.com for details." }).success, false);
  assert.equal(createPostSchema.safeParse({ body: "Please call 1234567890 for details." }).success, false);
  assert.equal(createCommentSchema.safeParse({ body: "Reach me at person@example.com" }).success, false);
});

test("comment and inquiry schemas enforce minimum content", () => {
  assert.equal(createCommentSchema.safeParse({ body: "OK" }).success, true);
  assert.equal(createInquirySchema.safeParse({ listingId: "listing_1", message: "Please share more details." }).success, true);
  assert.equal(createInquirySchema.safeParse({ listingId: "listing_1", message: "no" }).success, false);
});

test("report and moderation schemas only accept known statuses", () => {
  assert.equal(createReportSchema.safeParse({ postId: "post_1", reason: "Spam" }).success, true);
  assert.equal(createReportSchema.safeParse({ postId: "post_1", reason: "SomethingElse" }).success, false);
  assert.equal(reportStatusSchema.safeParse({ status: "RESOLVED" }).success, true);
  assert.equal(reportStatusSchema.safeParse({ status: "DELETE_EVERYTHING" }).success, false);
});

test("learning progress requires a boolean completion value", () => {
  assert.equal(progressSchema.safeParse({ lessonId: "lesson_1", completed: true }).success, true);
  assert.equal(progressSchema.safeParse({ lessonId: "lesson_1", completed: "yes" }).success, false);
});
