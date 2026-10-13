// Coordinates for Addis Ababa neighbourhoods and the restaurant.
// Also: a helper to interpolate the courier's position along the
// route from restaurant → delivery, based on the order status.

// [lat, lng] — Leaflet order, NOT GeoJSON.
// Getting this backwards puts Bole in the Indian Ocean.
const AREA_COORDS = {
  Bole: [8.995, 38.7896],
  Kazanchis: [9.0186, 38.7643],
  Megenagna: [9.022, 38.8022],
  Piassa: [9.035, 38.752],
  CMC: [9.019, 38.829],
  "Old Airport": [9.001, 38.74],
  Saris: [8.975, 38.758],
  Gerji: [9.017, 38.812],
  Summit: [9.04, 38.842],
  Ayat: [9.054, 38.883],
  Lafto: [8.983, 38.732],
  Other: [9.0054, 38.7636],
};

// The restaurant — every courier starts here.
// Bole, Addis Ababa (near the airport).
export const RESTAURANT = [9.0054, 38.7636];

// Turn a freeform address string into [lat, lng].
export function coordsForAddress(address) {
  if (!address) return RESTAURANT;
  const lower = address.toLowerCase();
  for (const [area, coords] of Object.entries(AREA_COORDS)) {
    if (lower.includes(area.toLowerCase())) return coords;
  }
  return AREA_COORDS.Other;
}

// Linear interpolation between two [lat, lng] points.
function lerp(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

// Where is the courier right now, based on the order status?
//
//   pending     → at the restaurant (food not started)
//   preparing   → at the restaurant (food being made)
//   on_the_way  → 60% of the way to the customer
//   delivered   → at the customer
//   cancelled   → back at the restaurant
//
// The key change: `preparing` no longer moves the courier. Only
// `on_the_way` puts it in transit.
export function courierPosition(status, deliveryCoords) {
  const t = {
    pending: 0,
    preparing: 0,      // <- stays at restaurant
    on_the_way: 0.6,   // <- in transit
    delivered: 1,
    cancelled: 0,
  }[status];

  const progress = typeof t === "number" ? t : 0;
  return lerp(RESTAURANT, deliveryCoords, progress);
}

// Human-friendly label for each status.
export function statusLabel(status) {
  return {
    pending: "Order received",
    preparing: "Preparing your order",
    on_the_way: "On the way",
    delivered: "Delivered",
    cancelled: "Cancelled",
  }[status] ?? status;
}