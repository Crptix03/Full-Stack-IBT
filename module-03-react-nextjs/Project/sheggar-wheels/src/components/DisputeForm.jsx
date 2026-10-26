"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { openDisputeAction } from "@/app/actions";
import { AlertTriangle, ChevronDown } from "lucide-react";

const REASONS = [
  "Car not as described",
  "Car not available on pickup",
  "Safety concern",
  "Owner unresponsive",
  "Damage dispute",
  "Payment issue",
  "Other",
];

export default function DisputeForm({ bookingId }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(REASONS[0]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!description.trim()) {
      setError("Please describe the issue.");
      return;
    }
    setError("");
    startTransition(async () => {
      const result = await openDisputeAction(bookingId, reason, description.trim());
      if (result?.error) {
        setError(result.error);
      } else {
        setOpen(false);
        router.refresh();
      }
    });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-5 py-2.5 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2"
      >
        <AlertTriangle className="w-4 h-4" />
        File a Dispute
      </button>
    );
  }

  return (
    <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-2xl">
      <h3 className="font-bold text-red-900 mb-1 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        File a Dispute
      </h3>
      <p className="text-xs text-red-700 mb-4">
        Disputes are reviewed by the admin team. Describe the issue clearly.
      </p>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-red-800 mb-1">
            Reason
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-red-200 rounded-xl text-sm focus:outline-none focus:border-red-400"
          >
            {REASONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-red-800 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe what happened in detail…"
            className="w-full px-4 py-3 bg-white border border-red-200 rounded-xl text-sm focus:outline-none focus:border-red-400 resize-none"
          />
        </div>

        {error && <p className="text-red-700 text-xs">{error}</p>}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? "Submitting…" : "Submit Dispute"}
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); setError(""); setDescription(""); }}
            className="px-5 py-2.5 border border-neutral-200 text-neutral-600 text-sm rounded-xl hover:text-neutral-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
