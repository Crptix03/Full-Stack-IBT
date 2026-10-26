// Booking lifecycle — server-side, reads/writes globalThis.__db directly.
// All exported functions are called from Server Actions in actions.js.
// Never import this file into a "use client" component.

import { db } from "./db";
import { newId } from "./id";

const PLATFORM_FEE_RATE = 0.05;

export const VALID_TRANSITIONS = {
  requested: ["confirmed", "declined", "cancelled"],
  confirmed: ["in_progress", "cancelled"],
  in_progress: ["completed"],
  completed: ["reviewed"],
};

export function canTransition(booking, newStatus) {
  if (!booking) return false;
  const allowed = VALID_TRANSITIONS[booking.status];
  return allowed ? allowed.includes(newStatus) : false;
}

// Check if a car is available for a date range (server-side).
export function isCarAvailable(carId, startDate, endDate, excludeBookingId = null) {
  const car = db.cars.find((c) => c.id === carId);
  if (!car) return false;

  for (const blocked of car.unavailableDates || []) {
    if (blocked >= startDate && blocked <= endDate) return false;
  }

  const active = db.bookings.filter(
    (b) =>
      b.carId === carId &&
      b.id !== excludeBookingId &&
      ["confirmed", "in_progress"].includes(b.status)
  );

  for (const b of active) {
    if (startDate < b.endDate && b.startDate < endDate) return false;
  }

  return true;
}

// Create a new booking. Called from the checkout Server Action.
export function createBooking({ carId, startDate, endDate, renterId }) {
  const car = db.cars.find((c) => c.id === carId);
  if (!car) return { error: "Car not found" };
  if (car.status !== "approved") return { error: "Car not available" };
  if (car.ownerId === renterId) return { error: "You cannot book your own car" };
  if (startDate >= endDate) return { error: "Invalid dates" };
  if (!isCarAvailable(carId, startDate, endDate)) {
    return { error: "Car is not available for those dates" };
  }

  const days = Math.max(
    1,
    Math.round((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
  );
  const subtotal = car.pricePerDay * days;
  const fee = Math.round(subtotal * PLATFORM_FEE_RATE);
  const total = subtotal + fee;

  const booking = {
    id: newId("bk"),
    carId,
    renterId,
    ownerId: car.ownerId,
    startDate,
    endDate,
    days,
    pricePerDay: car.pricePerDay,
    subtotal,
    fee,
    total,
    paymentStatus: "paid", // Mock payment — always succeeds
    status: "requested",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.bookings.push(booking);
  return { success: true, booking };
}

// Internal status transition helper.
function transition(bookingId, newStatus, actorId) {
  const idx = db.bookings.findIndex((b) => b.id === bookingId);
  if (idx === -1) return { error: "Booking not found" };

  const booking = db.bookings[idx];
  if (!canTransition(booking, newStatus)) {
    return { error: `Cannot go from ${booking.status} to ${newStatus}` };
  }

  const isRenterActor = actorId === booking.renterId;
  const isCarOwner = actorId === booking.ownerId;
  const actorUser = db.users.find((u) => u.id === actorId);
  const isAdminActor = actorUser?.roles?.includes("admin");

  if (!isRenterActor && !isCarOwner && !isAdminActor) {
    return { error: "Not yours" };
  }

  db.bookings[idx] = {
    ...booking,
    status: newStatus,
    updatedAt: new Date().toISOString(),
  };
  return { success: true, booking: db.bookings[idx] };
}

export function confirmBooking(bookingId, actorId) {
  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking) return { error: "Booking not found" };
  const actorUser = db.users.find((u) => u.id === actorId);
  const isAdminActor = actorUser?.roles?.includes("admin");
  if (actorId !== booking.ownerId && !isAdminActor) {
    return { error: "Only the car owner can confirm" };
  }
  return transition(bookingId, "confirmed", actorId);
}

export function declineBooking(bookingId, actorId) {
  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking) return { error: "Booking not found" };
  const actorUser = db.users.find((u) => u.id === actorId);
  const isAdminActor = actorUser?.roles?.includes("admin");
  if (actorId !== booking.ownerId && !isAdminActor) {
    return { error: "Only the car owner can decline" };
  }
  return transition(bookingId, "declined", actorId);
}

export function cancelBooking(bookingId, actorId) {
  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking) return { error: "Booking not found" };
  if (actorId !== booking.renterId && actorId !== booking.ownerId) {
    return { error: "Not yours" };
  }
  return transition(bookingId, "cancelled", actorId);
}

export function startRental(bookingId, actorId) {
  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking) return { error: "Booking not found" };
  if (actorId !== booking.ownerId) {
    return { error: "Only the car owner can start the rental" };
  }
  return transition(bookingId, "in_progress", actorId);
}

export function completeRental(bookingId, actorId) {
  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking) return { error: "Booking not found" };
  if (actorId !== booking.ownerId) {
    return { error: "Only the car owner can complete the rental" };
  }
  return transition(bookingId, "completed", actorId);
}

export function submitReview(bookingId, rating, comment, renterId) {
  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking) return { error: "Booking not found" };
  if (booking.renterId !== renterId) return { error: "Not yours" };
  if (booking.status !== "completed") {
    return { error: "Can only review completed bookings" };
  }
  if (db.reviews.some((r) => r.bookingId === bookingId)) {
    return { error: "Already reviewed" };
  }

  const review = {
    id: newId("rv"),
    bookingId,
    carId: booking.carId,
    renterId,
    ownerId: booking.ownerId,
    rating: Math.max(1, Math.min(5, rating)),
    comment: comment || "",
    ownerReply: null,
    createdAt: new Date().toISOString(),
  };

  db.reviews.push(review);

  const idx = db.bookings.findIndex((b) => b.id === bookingId);
  db.bookings[idx] = {
    ...db.bookings[idx],
    status: "reviewed",
    updatedAt: new Date().toISOString(),
  };

  return { success: true, review };
}
