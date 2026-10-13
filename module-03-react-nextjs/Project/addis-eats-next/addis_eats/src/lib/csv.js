// CSV export helpers.
//
// The trap: a value containing a comma, quote, or newline breaks naive
// join(","). One comma in one restaurant name ("Bole, Kitfo") shifts
// every column after it and corrupts the export.
//
// Rule: if a value contains a comma, quote, or newline — wrap it in
// double quotes AND double any quotes inside it.

// ── Escape a single cell ────────────────────────────────
function escapeCell(value) {
  // null/undefined → empty string
  if (value === null || value === undefined) return "";

  const s = String(value);

  // Does the value need quoting?
  // - contains a comma, quote, newline, or carriage return
  // - OR starts/ends with whitespace (Excel trims unquoted whitespace)
  const needsQuotes = /[",\r\n]/.test(s) || /^\s|\s$/.test(s);

  if (!needsQuotes) return s;

  // Double any existing quotes, then wrap the whole thing
  return `"${s.replace(/"/g, '""')}"`;
}

// ── Convert an array of objects to a CSV string ─────────
// rows = [{ id: "1", name: "Bole, Kitfo", total: 750 }, ...]
// Columns come from the first row's keys.
export function toCsv(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const headerLine = headers.map(escapeCell).join(",");

  const bodyLines = rows.map((row) =>
    headers.map((key) => escapeCell(row[key])).join(",")
  );

  return [headerLine, ...bodyLines].join("\r\n");
}

// ── Build a Blob and trigger a download ─────────────────
// Runs entirely in the browser. No server round trip.
// Release the object URL afterwards — otherwise it lives in memory
// until the tab closes.
export function downloadCsv(csvText, filename) {
  const blob = new Blob([csvText], {
    type: "text/csv;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}