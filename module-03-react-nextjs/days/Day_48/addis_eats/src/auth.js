import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { findUserByUsername } from "@/lib/users";

// ── NextAuth v5 configuration ─────────────────────────
//
// Google is the only real OAuth provider. Existing demo accounts
// continue to work through the username/password flow in actions.js
// and share the same cookie-based session system underneath.
//
// Every Google user is treated as a customer and given a stable id
// derived from their Google account (sub), so order ownership checks
// work identically to the demo accounts.

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    // Persist the user id and role into the JWT.
    async jwt({ token, account, profile }) {
      if (account?.provider === "google" && profile) {
        token.userId = `g-${profile.sub}`;
        token.role = "customer";
        token.username = profile.email?.split("@")[0] ?? "google-user";
      } else if (!token.userId && token.sub) {
        // Fallback for sessions created without the above
        token.userId = `g-${token.sub}`;
        token.role = token.role || "customer";
        token.username = token.username || "google-user";
      }
      return token;
    },

    // Expose those values to the client-side session object.
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId;
        session.user.role = token.role;
        session.user.username = token.username;
      }
      return session;
    },
  },
});

// Helper for pages that need to check the NextAuth session.
// Returns null if not signed in via Google. The demo-account flow
// is separate and continues to use src/lib/session.js.
export async function getAuthSession() {
  const session = await auth();
  return session;
}

// Helper to look up the demo user record for a Google session.
// Google users don't exist in users.js — we synthesize a minimal
// record so the rest of the app keeps working.
export function googleUserFromSession(session) {
  if (!session?.user?.id) return null;
  return {
    id: session.user.id,
    username: session.user.username || "google-user",
    role: session.user.role || "customer",
    provider: "google",
  };
}

// Keep this import for side effect: ensures user lookup uses the same shape.
void findUserByUsername;