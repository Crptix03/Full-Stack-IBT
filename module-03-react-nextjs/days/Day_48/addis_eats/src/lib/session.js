import { cookies } from "next/headers";
import { auth } from "@/auth";

const COOKIE_NAME = "session";

// ── Create a demo-account session ─────────────────────
// Sets an HttpOnly cookie. Called only from the demo signIn
// server action (username/password flow).
export async function createSession(userId, role) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  cookieStore.set("role", role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

// ── Read a session (unified) ──────────────────────────
// Checks NextAuth first (Google users), then falls back to the
// demo cookie. Returns { userId, role, username } or null.
export async function getSession() {
  // 1. NextAuth session (Google sign-in)
  try {
    const authSession = await auth();
    if (authSession?.user?.id) {
      return {
        userId: authSession.user.id,
        role: authSession.user.role || "customer",
        username: authSession.user.username || "google-user",
        provider: "google",
      };
    }
  } catch {
    // NextAuth not configured yet or token invalid — fall through
  }

  // 2. Demo cookie session
  const cookieStore = await cookies();
  const userId = cookieStore.get(COOKIE_NAME)?.value;
  const role = cookieStore.get("role")?.value;

  if (!userId) return null;

  return {
    userId,
    role: role || "customer",
    provider: "demo",
  };
}

// ── Destroy a demo session ────────────────────────────
// NextAuth handles its own sign-out via the signOut() action
// exposed from auth.js.
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  cookieStore.delete("role");
}