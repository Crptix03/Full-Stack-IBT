"use client";

import { useState } from "react";
import { toCsv, downloadCsv } from "@/lib/csv";

// Builds the CSV in the browser — no server round trip.
// The orders are already on the page, so this is instant.
//
// Each row is flattened into a shape designed for a spreadsheet:
// one row per order, columns for the fields a person would want.

export default function ExportButton({ orders, filename = "orders.csv" }) {
  const [busy, setBusy] = useState(false);

  const handleExport = () => {
    setBusy(true);
    try {
      const rows = orders.map((o) => ({
        "Order ID": o.id,
        Date: o.createdAt ?? "",
        Status: o.status ?? "",
        Customer: o.customerName ?? "",
        Phone: o.phone ?? "",
        Address: o.address ?? "",
        Items: (o.items ?? []).length,
        "Total (ETB)": o.total ?? 0,
      }));

      const csv = toCsv(rows);
      downloadCsv(csv, filename);
    } catch (err) {
      // Silent by design — download rarely fails, and an alert is
      // worse than a failed click.
      console.error("CSV export failed:", err);
    } finally {
      // Give the browser a moment to trigger the download before
      // re-enabling the button.
      setTimeout(() => setBusy(false), 300);
    }
  };

  if (!orders || orders.length === 0) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={busy}
      className="px-4 py-2 text-xs font-semibold border border-neutral-700 text-neutral-300 rounded-lg hover:border-amber-400 hover:text-amber-400 disabled:opacity-50 transition-colors inline-flex items-center gap-2"
    >
      <DownloadIcon />
      {busy ? "Exporting…" : "Export CSV"}
    </button>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}