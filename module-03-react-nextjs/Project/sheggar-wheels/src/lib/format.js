// Formatters built once at module level.
// Locale + time zone always named explicitly.

export const etb = new Intl.NumberFormat("en-ET", {
  style: "currency",
  currency: "ETB",
  maximumFractionDigits: 0,
});

export const when = new Intl.DateTimeFormat("en-ET", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Addis_Ababa",
});

export const relativeFormat = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

export function relative(date) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  const diffMs = d.getTime() - Date.now();
  const absMs = Math.abs(diffMs);

  const seconds = Math.round(diffMs / 1000);
  const minutes = Math.round(diffMs / (1000 * 60));
  const hours = Math.round(diffMs / (1000 * 60 * 60));
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (absMs < 60 * 1000) return relativeFormat.format(seconds, "second");
  if (absMs < 60 * 60 * 1000) return relativeFormat.format(minutes, "minute");
  if (absMs < 24 * 60 * 60 * 1000) return relativeFormat.format(hours, "hour");
  return relativeFormat.format(days, "day");
}