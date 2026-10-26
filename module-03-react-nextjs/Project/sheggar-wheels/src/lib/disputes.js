// Dispute lifecycle — server-side, reads/writes globalThis.__db directly.

import { db } from "./db";
import { newId } from "./id";

// Initialise disputes array on db if not present (older seed may not have it).
if (!db.disputes) db.disputes = [];

export function openDispute(bookingId, reason, description, actorId) {
  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking) return { error: "Booking not found" };
  if (booking.renterId !== actorId && booking.ownerId !== actorId) {
    return { error: "Not yours" };
  }
  if (!["confirmed", "in_progress", "completed"].includes(booking.status)) {
    return { error: "Cannot dispute a booking in this state" };
  }

  const dispute = {
    id: newId("dispute"),
    bookingId,
    openedBy: actorId,
    reason,
    description,
    status: "open",
    resolutionNotes: null,
    resolvedBy: null,
    createdAt: new Date().toISOString(),
    resolvedAt: null,
  };

  db.disputes.push(dispute);

  const idx = db.bookings.findIndex((b) => b.id === bookingId);
  db.bookings[idx] = { ...db.bookings[idx], status: "disputed", updatedAt: new Date().toISOString() };

  return { success: true };
}

export function resolveDispute(disputeId, notes, adminId) {
  const adminUser = db.users.find((u) => u.id === adminId);
  if (!adminUser?.roles?.includes("admin")) return { error: "Admin only" };

  const idx = db.disputes.findIndex((d) => d.id === disputeId);
  if (idx === -1) return { error: "Not found" };

  db.disputes[idx] = {
    ...db.disputes[idx],
    status: "resolved",
    resolutionNotes: notes,
    resolvedBy: adminId,
    resolvedAt: new Date().toISOString(),
  };

  const bIdx = db.bookings.findIndex((b) => b.id === db.disputes[idx].bookingId);
  if (bIdx !== -1) {
    db.bookings[bIdx] = { ...db.bookings[bIdx], status: "resolved", updatedAt: new Date().toISOString() };
  }

  return { success: true };
}
