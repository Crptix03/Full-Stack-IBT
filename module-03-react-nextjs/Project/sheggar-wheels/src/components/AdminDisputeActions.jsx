"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { resolveDisputeAction } from "@/app/actions";

export default function AdminDisputeActions({ disputeId }) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleResolve = () => {
    if (!notes.trim()) return;
    setError("");
    startTransition(async () => {
      const result = await resolveDisputeAction(disputeId, notes.trim());
      if (result?.error) setError(result.error);
      else router.refresh();
    });
  };

  return (
    <div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        placeholder="Resolution notes…"
        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 resize-none mb-2"
      />
      {error && <p className="text-red-600 text-xs mb-2">{error}</p>}
      <button
        onClick={handleResolve}
        disabled={isPending || !notes.trim()}
        className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        {isPending ? "Resolving…" : "Mark Resolved"}
      </button>
    </div>
  );
}
