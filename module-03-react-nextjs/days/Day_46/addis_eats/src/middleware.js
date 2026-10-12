import { NextResponse } from "next/server";

const COOKIE_NAME = "session";

// ── Protected paths ────────────────────────────────────
// Any path starting with one of these needs a session.
const PROTECTED_PREFIXES = ["/checkout", "/orders"];

// ── Staff-only paths ───────────────────────────────────
// Require role === "staff".
const STAFF_PREFIXES = ["/kitchen"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Read session from cookies (available at the edge)
  const session = request.cookies.get(COOKIE_NAME)?.value;
  const role = request.cookies.get("role")?.value;

  // ── Staff check ──────────────────────────────────────
  const needsStaff = STAFF_PREFIXES.some((p) => pathname.startsWith(p));
  if (needsStaff) {
    if (!session) {
      return redirectToSignIn(request);
    }
    if (role !== "staff") {
      // Signed in but not staff — send them to the home page
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // ── Regular protected check ──────────────────────────
  const needsAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (needsAuth && !session) {
    return redirectToSignIn(request);
  }

  return NextResponse.next();
}

// ── Redirect helper ────────────────────────────────────
function redirectToSignIn(request) {
  const signInUrl = new URL("/signin", request.url);
  // Carry the intended destination
  signInUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(signInUrl);
}


export const config = {
  matcher: [
    "/checkout/:path*",
    "/orders/:path*",
    "/kitchen/:path*",
    "/profile/:path*",
    "/profile",
  ],
};