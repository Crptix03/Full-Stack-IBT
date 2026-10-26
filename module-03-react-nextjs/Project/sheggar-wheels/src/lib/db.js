// Server-side in-memory database.
// ⚠️ DEMO ONLY — this resets every time the server restarts.
// In a real app, this would be a PostgreSQL or MongoDB database.

import { SEED_USERS, SEED_CARS, SEED_BOOKINGS, SEED_REVIEWS } from "./seed";

if (!globalThis.__db) {
  globalThis.__db = {
    users: [...SEED_USERS],
    cars: [...SEED_CARS],
    bookings: [...SEED_BOOKINGS],
    reviews: [...SEED_REVIEWS],
  };
}

export const db = globalThis.__db;

// ── Generic Helpers (Optional) ───────────────────────
// You can use these directly in Server Components or API Routes.

export function getCars() {
  return db.cars;
}

export function getBookings() {
  return db.bookings;
}

export function getUsers() {
  return db.users;
}