// CSV export helpers — RFC 4180 escaping.
// Used by /bookings to export the renter's history.

function escapeCell(value) {
  if (value === null || value === undefined) return "";
  const s = String(value);
  const needsQuotes = /[",\r\n]/.test(s) || /^\s|\s$/.test(s);
  if (!needsQuotes) return s;
  return `"${s.replace(/"/g, '""')}"`;
}

export function toCsv(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const headerLine = headers.map(escapeCell).join(",");
  const bodyLines = rows.map((row) =>
    headers.map((key) => escapeCell(row[key])).join(",")
  );
  return [headerLine, ...bodyLines].join("\r\n");
}

export function downloadCsv(csvText, filename) {
  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}