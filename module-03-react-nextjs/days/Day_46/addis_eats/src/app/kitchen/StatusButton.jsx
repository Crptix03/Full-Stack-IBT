"use client";

import { useTransition } from "react";
import { updateOrderStatusAction } from "@/app/actions";

export default function StatusButton({ orderId, currentStatus }) {
  const [isPending, startTransition] = useTransition();

  // Determine the next status based on current
  const next = (() => {
    switch (currentStatus) {
      case "pending":
        return { status: "preparing", label: "Start Preparing" };
      case "preparing":
        return { status: "delivered", label: "Mark Delivered" };
      default:
        return null;
    }
  })();

  if (!next) {
    return (
      <p className="text-xs text-neutral-500 italic">
        No further action available.
      </p>
    );
  }

  const handleClick = () => {
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, next.status);
      if (result?.error) {
        alert(result.error);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="px-4 py-2 bg-amber-400 text-neutral-900 text-sm font-semibold rounded hover:bg-amber-300 disabled:opacity-50 transition-colors"
    >
      {isPending ? "Updating…" : next.label}
    </button>
  );
}