"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveCarAction, rejectCarAction } from "@/app/actions";

export default function AdminCarActions({ carId, currentStatus }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const act = (fn) => {
    startTransition(async () => {
      await fn(carId);
      router.refresh();
    });
  };

  if (currentStatus === "approved") {
    return (
      <button onClick={() => act(rejectCarAction)} disabled={isPending}
        className="px-4 py-1.5 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors">
        Reject
      </button>
    );
  }
  if (currentStatus === "pending") {
    return (
      <div className="flex gap-2">
        <button onClick={() => act(approveCarAction)} disabled={isPending}
          className="px-4 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
          Approve
        </button>
        <button onClick={() => act(rejectCarAction)} disabled={isPending}
          className="px-4 py-1.5 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors">
          Reject
        </button>
      </div>
    );
  }
  if (currentStatus === "rejected") {
    return (
      <button onClick={() => act(approveCarAction)} disabled={isPending}
        className="px-4 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
        Re-approve
      </button>
    );
  }
  return null;
}
