export function toCarSlug(make, model, year) {
  return `${make}-${model}-${year}`
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function findCarBySlug(cars, slug) {
  return cars.find((c) => toCarSlug(c.make, c.model, c.year) === slug) || null;
}
