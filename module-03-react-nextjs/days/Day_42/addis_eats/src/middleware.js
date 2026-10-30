import { NextResponse } from "next/server";

const COOKIE_NAME = "session";

const PROTECTED_PREFIXES = ["/checkout", "/orders"];

const STAFF_PREFIXES = ["/kitchen"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const session = request.cookies.get(COOKIE_NAME)?.value;
  const role = request.cookies.get("role")?.value;

  const needsStaff = STAFF_PREFIXES.some((p) => pathname.startsWith(p));
  if (needsStaff) {
    if (!session) {
      return redirectToSignIn(request);
    }
    if (role !== "staff") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  const needsAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (needsAuth && !session) {
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
  matcher: ["/checkout/:path*", "/orders/:path*", "/kitchen/:path*"],
};