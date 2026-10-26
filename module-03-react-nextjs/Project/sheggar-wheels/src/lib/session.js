import { cookies } from "next/headers";

const COOKIE_NAME = "session";

// ── Create a session ──────────────────────────────────
// Sets an HttpOnly cookie with the user's id and role.
export async function createSession(userId, role) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  cookieStore.set("role", role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

// ── Read a session ────────────────────────────────────
// Returns { userId, role } or null.
export async function getSession() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(COOKIE_NAME)?.value;
  const role = cookieStore.get("role")?.value;

  if (!userId) return null;

  return { userId, role: role || "customer" };
}

// ── Destroy a session ─────────────────────────────────
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  cookieStore.delete("role");
}

// ── Safe return path ──────────────────────────────────
// Keeps the safe redirect logic we had before.
export function safeReturnPath(value, fallback = "/") {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  return value;
}