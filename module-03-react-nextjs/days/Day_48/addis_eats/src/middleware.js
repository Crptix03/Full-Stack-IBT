import { NextResponse } from "next/server";

// ── Cookie names ──────────────────────────────────────
// Demo accounts: a plain "session" cookie with the userId.
// Google / NextAuth: one of these two cookies, depending on
// whether the connection is HTTPS or HTTP.
const DEMO_COOKIE = "session";

const NEXTAUTH_COOKIES = [
  "__Secure-authjs.session-token", // production (HTTPS)
  "authjs.session-token",          // development (HTTP)
  "__Secure-next-auth.session-token", // older name, kept for safety
  "next-auth.session-token",
];

// ── Protected paths ───────────────────────────────────
const PROTECTED_PREFIXES = ["/checkout", "/orders", "/profile"];

// ── Staff-only paths ──────────────────────────────────
const STAFF_PREFIXES = ["/kitchen", "/dashboard"];

function hasAnySession(request) {
  // Demo cookie?
  if (request.cookies.get(DEMO_COOKIE)?.value) return true;

  // Any NextAuth cookie present?
  for (const name of NEXTAUTH_COOKIES) {
    if (request.cookies.get(name)?.value) return true;
  }

  return false;
}

function getRoleHint(request) {
  // The demo flow sets a separate "role" cookie. Google users are
  // always customers, so any Google session implies role = customer.
  const demoRole = request.cookies.get("role")?.value;
  if (demoRole) return demoRole;

  // NextAuth cookie present → Google user → customer.
  for (const name of NEXTAUTH_COOKIES) {
    if (request.cookies.get(name)?.value) return "customer";
  }

  return null;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const signedIn = hasAnySession(request);
  const role = getRoleHint(request);

  // ── Staff check ──────────────────────────────────────
  const needsStaff = STAFF_PREFIXES.some((p) => pathname.startsWith(p));
  if (needsStaff) {
    if (!signedIn) return redirectToSignIn(request);
    if (role !== "staff") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // ── Regular protected check ──────────────────────────
  const needsAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (needsAuth && !signedIn) {
    return redirectToSignIn(request);
  }

  return NextResponse.next();
}

function redirectToSignIn(request) {
  const signInUrl = new URL("/signin", request.url);
  signInUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: [
    "/checkout/:path*",
    "/orders/:path*",
    "/kitchen/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/profile",
  ],
};