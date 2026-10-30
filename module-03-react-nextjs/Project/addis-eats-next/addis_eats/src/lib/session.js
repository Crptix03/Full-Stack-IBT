import { cookies } from "next/headers";
import { auth } from "@/auth";

const COOKIE_NAME = "session";

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

export async function getSession() {
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
  }

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

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  cookieStore.delete("role");
}