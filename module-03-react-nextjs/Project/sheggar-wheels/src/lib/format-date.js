
export function formatDate(isoDate) {
  if (!isoDate) return "—";
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRange(startIso, endIso) {
  if (!startIso || !endIso) return "—";
  const s = new Date(startIso + "T00:00:00");
  const e = new Date(endIso + "T00:00:00");

  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    return `${s.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${e.toLocaleDateString("en-US", { day: "numeric", year: "numeric" })}`;
  }

  return `${formatDate(startIso)} – ${formatDate(endIso)}`;
}

export function nightsBetween(startIso, endIso) {
  if (!startIso || !endIso) return 0;
  const s = new Date(startIso + "T00:00:00");
  const e = new Date(endIso + "T00:00:00");
  const ms = e - s;
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function isValidDateRange(startIso, endIso) {
  if (!startIso || !endIso) return false;
  if (startIso === endIso) return false;
  return new Date(startIso) < new Date(endIso);
}

export function rangesOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

export function dateInRange(dateIso, startIso, endIso) {
  return dateIso >= startIso && dateIso <= endIso;
}