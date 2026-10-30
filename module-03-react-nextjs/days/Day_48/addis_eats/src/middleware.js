import { NextResponse } from "next/server";

const DEMO_COOKIE = "session";

const NEXTAUTH_COOKIES = [
  "__Secure-authjs.session-token",
  "authjs.session-token",
  "__Secure-next-auth.session-token",
  "next-auth.session-token",
];

const PROTECTED_PREFIXES = ["/checkout", "/orders", "/profile"];

const STAFF_PREFIXES = ["/kitchen", "/dashboard"];

function hasAnySession(request) {
  if (request.cookies.get(DEMO_COOKIE)?.value) return true;

  for (const name of NEXTAUTH_COOKIES) {
    if (request.cookies.get(name)?.value) return true;
  }

  return false;
}

function getRoleHint(request) {
  const demoRole = request.cookies.get("role")?.value;
  if (demoRole) return demoRole;

  for (const name of NEXTAUTH_COOKIES) {
    if (request.cookies.get(name)?.value) return "customer";
  }

  return null;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const signedIn = hasAnySession(request);
  const role = getRoleHint(request);

  const needsStaff = STAFF_PREFIXES.some((p) => pathname.startsWith(p));
  if (needsStaff) {
    if (!signedIn) return redirectToSignIn(request);
    if (role !== "staff") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    return NextResponse.next();
  }

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