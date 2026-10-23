// Safe localStorage helpers.
//
// Rules:
//  - Never throw on missing or malformed data — return the fallback.
//  - Never write passwords or secrets (the brief is explicit).
//  - Handle quota errors gracefully.

const isBrowser = typeof window !== "undefined";

export function readStorage(key, fallback) {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    // Malformed JSON or storage inaccessible — return fallback.
    return fallback;
  }
}

export function writeStorage(key, value) {
  if (!isBrowser) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // Quota exceeded or storage disabled.
    return false;
  }
}

export function removeStorage(key) {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(key);
  } catch {}
}

// ── Session storage (per tab) ─────────────────────────
export function readSession(key, fallback) {
  if (!isBrowser) return fallback;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeSession(key, value) {
  if (!isBrowser) return false;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeSession(key) {
  if (!isBrowser) return;
  try {
    window.sessionStorage.removeItem(key);
  } catch {}
}

// ── Storage keys ─────────────────────────────────────
// Centralised so typos can never silently break the app.
export const KEYS = {
  USERS: "sw_users_v1",
  CARS: "sw_cars_v1",
  BOOKINGS: "sw_bookings_v1",
  REVIEWS: "sw_reviews_v1",
  SESSION: "sw_session_v1",
  CHECKOUT_DRAFT: "sw_checkout_draft_v1",
};