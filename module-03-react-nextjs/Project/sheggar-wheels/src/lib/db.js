// ⚠️ DEMO ONLY — this resets every time the server restarts.

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


export function getCars() {
  return db.cars;
}

export function getBookings() {
  return db.bookings;
}

export function getUsers() {
  return db.users;
}