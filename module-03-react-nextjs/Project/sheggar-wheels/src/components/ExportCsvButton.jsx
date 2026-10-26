"use client";

import { toCsv, downloadCsv } from "@/lib/csv";
import { Download } from "lucide-react";

export default function ExportCsvButton({ data, filename, label = "Export CSV" }) {
  const handleExport = () => {
    const csv = toCsv(data);
    downloadCsv(csv, filename);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
    >
      <Download className="w-4 h-4" />
      {label}
    </button>
  );
}
