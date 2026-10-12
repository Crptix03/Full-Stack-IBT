import { getDishes } from "@/lib/dishes";
import { toSlug } from "./menu/slug";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Static public routes
  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/menu`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/signin`, lastModified: new Date(), priority: 0.5 },
  ];

  // Dynamic dish routes
  const dishes = await getDishes();
  const dishRoutes = dishes.map((dish) => ({
    url: `${baseUrl}/menu/${toSlug(dish.name)}`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  return [...staticRoutes, ...dishRoutes];
}