import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Routes and the minimum role required to access them.
const PROTECTED = [
  { prefix: "/admin",    role: "admin" },
  { prefix: "/owner",    role: "owner" },
  { prefix: "/dashboard", role: "renter" },
  { prefix: "/bookings", role: "renter" },
  { prefix: "/checkout", role: "renter" },
  { prefix: "/profile",  role: "renter" },
];

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  const rule = PROTECTED.find((r) => pathname.startsWith(r.prefix));
  if (!rule) return NextResponse.next();

  const cookieStore = await cookies();
  const userId = cookieStore.get("session")?.value;
  const role   = cookieStore.get("role")?.value;

  // Not signed in — redirect to sign in
  if (!userId) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Wrong role — redirect home
  if (rule.role === "admin" && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (rule.role === "owner" && role !== "owner" && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  // renter: any signed-in user can access renter routes

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/owner/:path*",
    "/dashboard/:path*",
    "/bookings/:path*",
    "/checkout/:path*",
    "/profile/:path*",
    "/profile",
  ],
};
