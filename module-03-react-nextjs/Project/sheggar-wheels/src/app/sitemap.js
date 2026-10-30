import { db } from "@/lib/db";
import { toCarSlug } from "@/lib/slug";

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function sitemap() {
  const staticRoutes = [
    { url: `${BASE}/`,       lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/cars`,   lastModified: new Date(), changeFrequency: "hourly",  priority: 0.9 },
    { url: `${BASE}/signin`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/signup`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const carRoutes = db.cars
    .filter((c) => c.status === "approved")
    .map((car) => ({
      url:             `${BASE}/cars/${toCarSlug(car.make, car.model, car.year)}`,
      lastModified:    new Date(car.createdAt),
      changeFrequency: "weekly",
      priority:        0.8,
    }));

  return [...staticRoutes, ...carRoutes];
}
