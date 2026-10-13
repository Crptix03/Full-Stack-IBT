"use client";

import { useTransition, useState } from "react";
import { cancelOrder } from "@/app/actions";

// Two-click cancel with inline confirmation.
// compact = small text button for table rows.
// non-compact = full-width button for the track page.
export default function CancelOrderButton({ orderId, compact = false }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    startTransition(async () => {
      const result = await cancelOrder(orderId);
      if (result?.error) {
        alert(result.error);
        setConfirming(false);
      }
      // On success the server action revalidates the page,
      // so the status will update or the row will refresh.
    });
  };

  if (isPending) {
    return (
      <span className={`text-xs text-neutral-500 ${compact ? "" : "py-2"}`}>
        Cancelling…
      </span>
    );
  }

  if (confirming) {
    return (
      <span
        className={`inline-flex items-center gap-2 ${
          compact ? "text-xs" : "text-sm"
        }`}
      >
        <button
          type="button"
          onClick={handleCancel}
          className="text-red-400 hover:text-red-300 font-medium"
        >
          Confirm cancel
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-neutral-500 hover:text-neutral-300"
        >
          Keep
        </button>
      </span>
    );
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-red-400 text-xs hover:underline"
      >
        Cancel
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="px-4 py-2 text-sm border border-red-900/40 text-red-400 rounded-lg hover:bg-red-950/30 transition-colors"
    >
      Cancel this order
    </button>
  );
}