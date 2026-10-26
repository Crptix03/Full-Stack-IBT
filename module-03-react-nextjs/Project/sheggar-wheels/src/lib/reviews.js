// Review helpers — server-side, reads/writes globalThis.__db directly.

import { db } from "./db";

export function replyToReview(reviewId, reply, ownerId) {
  const idx = db.reviews.findIndex((r) => r.id === reviewId);
  if (idx === -1) return { error: "Review not found" };
  if (db.reviews[idx].ownerId !== ownerId) return { error: "Not your review" };

  db.reviews[idx] = { ...db.reviews[idx], ownerReply: reply };
  return { success: true };
}
