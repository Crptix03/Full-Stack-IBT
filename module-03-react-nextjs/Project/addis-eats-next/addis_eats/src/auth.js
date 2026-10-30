import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { findUserByUsername } from "@/lib/users";


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
    async jwt({ token, account, profile }) {
      if (account?.provider === "google" && profile) {
        token.userId = `g-${profile.sub}`;
        token.role = "customer";
        token.username = profile.email?.split("@")[0] ?? "google-user";
      } else if (!token.userId && token.sub) {
        token.userId = `g-${token.sub}`;
        token.role = token.role || "customer";
        token.username = token.username || "google-user";
      }
      return token;
    },

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

export async function getAuthSession() {
  const session = await auth();
  return session;
}

export function googleUserFromSession(session) {
  if (!session?.user?.id) return null;
  return {
    id: session.user.id,
    username: session.user.username || "google-user",
    role: session.user.role || "customer",
    provider: "google",
  };
}

void findUserByUsername;