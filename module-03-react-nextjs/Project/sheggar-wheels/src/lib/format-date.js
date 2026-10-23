// Booking-focused date helpers.
// All stored dates are YYYY-MM-DD strings (ISO).

// Format an ISO date string as "Nov 5, 2026"
export function formatDate(isoDate) {
  if (!isoDate) return "—";
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Format a date range: "Nov 5 – Nov 7, 2026"
export function formatRange(startIso, endIso) {
  if (!startIso || !endIso) return "—";
  const s = new Date(startIso + "T00:00:00");
  const e = new Date(endIso + "T00:00:00");

  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    return `${s.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${e.toLocaleDateString("en-US", { day: "numeric", year: "numeric" })}`;
  }

  return `${formatDate(startIso)} – ${formatDate(endIso)}`;
}

// Number of nights between two ISO dates
export function nightsBetween(startIso, endIso) {
  if (!startIso || !endIso) return 0;
  const s = new Date(startIso + "T00:00:00");
  const e = new Date(endIso + "T00:00:00");
  const ms = e - s;
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

// Today as YYYY-MM-DD
export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// Is the start date before the end date?
export function isValidDateRange(startIso, endIso) {
  if (!startIso || !endIso) return false;
  if (startIso === endIso) return false;
  return new Date(startIso) < new Date(endIso);
}

// Two date ranges overlap?
export function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

// Is a specific ISO date inside a range (inclusive)?
export function dateInRange(dateIso, startIso, endIso) {
  return dateIso >= startIso && dateIso <= endIso;
}