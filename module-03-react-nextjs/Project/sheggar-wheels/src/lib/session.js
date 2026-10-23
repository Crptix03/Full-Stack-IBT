// Demo session — stored in sessionStorage.
// Only the user ID is stored; the full user record is looked up
// from localStorage on every read.

import {
  readSession,
  writeSession,
  removeSession,
  readStorage,
  KEYS,
} from "./storage";

const SESSION_KEY = KEYS.SESSION;

export function signInAsDemo(userId) {
  writeSession(SESSION_KEY, {
    userId,
    signedInAt: new Date().toISOString(),
  });
}

export function signOut() {
  removeSession(SESSION_KEY);
}

export function getCurrentSession() {
  const stored = readSession(SESSION_KEY, null);
  if (!stored?.userId) return null;

  const users = readStorage(KEYS.USERS, []);
  const user = users.find((u) => u.id === stored.userId);
  if (!user) return null;

  return user;
}

// Safe return path — never redirect to an external URL.
// Accepts "/cars/abc", rejects "https://evil.com", "//evil.com", etc.
export function safeReturnPath(value, fallback = "/") {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  return value;
}