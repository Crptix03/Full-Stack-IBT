// Converts a car's make, model, and year into a URL-safe slug.
// e.g. "Mazda", "CX-5", 2022 → "mazda-cx-5-2022"
export function toCarSlug(make, model, year) {
  return `${make}-${model}-${year}`
    .toLowerCase()
    .replace(/\s+/g, "-")       // spaces → dashes
    .replace(/[^a-z0-9-]/g, "") // remove anything not alphanumeric or dash
    .replace(/-+/g, "-")        // collapse multiple dashes
    .replace(/^-|-$/g, "");     // trim leading/trailing dashes
}

// Find a car in an array by its slug.
export function findCarBySlug(cars, slug) {
  return cars.find((c) => toCarSlug(c.make, c.model, c.year) === slug) || null;
}
