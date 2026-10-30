const BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/cars", "/cars/"],
        // Private routes — should never be indexed
        disallow: [
          "/dashboard",
          "/bookings",
          "/checkout",
          "/profile",
          "/owner",
          "/admin",
          "/signin",
          "/signup",
          "/unauthorized",
          "/api/",
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
