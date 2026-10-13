// One formatter module, imported everywhere.
//
// Every formatter is built ONCE at module level — creating a formatter is
// expensive; calling one is not. Rebuilding inside a loop would make a
// 4,000-row list crawl.
//
// Locale and time zone are ALWAYS named explicitly. Relying on the
// environment means the server and the browser disagree, and React
// notices (hydration mismatch).

// ── Currency ────────────────────────────────────────────
// Ethiopian Birr. No decimals — birr are whole units in this app.
export const etb = new Intl.NumberFormat("en-ET", {
  style: "currency",
  currency: "ETB",
  maximumFractionDigits: 0,
});

// ── Absolute date + time ────────────────────────────────
// Medium date, short time, in Addis time. EAT is UTC+3 all year —
// but we name the zone anyway rather than trusting the server.
export const when = new Intl.DateTimeFormat("en-ET", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Addis_Ababa",
});

// ── Relative time ───────────────────────────────────────
// "12 minutes ago", "yesterday". Built once, reused everywhere.
export const relativeFormat = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

// Small helper: turn a date into the closest sensible relative unit.
// Returns a string like "12 minutes ago" or "2 days ago".
export function relative(date) {
  if (!date) return "";

  const d = date instanceof Date ? date : new Date(date);
  const now = Date.now();
  const diffMs = d.getTime() - now; // negative = past
  const absMs = Math.abs(diffMs);

  const seconds = Math.round(diffMs / 1000);
  const minutes = Math.round(diffMs / (1000 * 60));
  const hours = Math.round(diffMs / (1000 * 60 * 60));
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (absMs < 60 * 1000) {
    return relativeFormat.format(seconds, "second");
  }
  if (absMs < 60 * 60 * 1000) {
    return relativeFormat.format(minutes, "minute");
  }
  if (absMs < 24 * 60 * 60 * 1000) {
    return relativeFormat.format(hours, "hour");
  }
  return relativeFormat.format(days, "day");
}