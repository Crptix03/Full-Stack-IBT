"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  confirmBookingAction,
  declineBookingAction,
  startRentalAction,
  completeRentalAction,
} from "@/app/actions";

export default function OwnerBookingActions({ booking }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const act = (fn) => {
    startTransition(async () => {
      await fn(booking.id);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {booking.status === "requested" && (
        <>
          <button
            onClick={() => act(confirmBookingAction)}
            disabled={isPending}
            className="px-4 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            Confirm
          </button>
          <button
            onClick={() => act(declineBookingAction)}
            disabled={isPending}
            className="px-4 py-1.5 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
          >
            Decline
          </button>
        </>
      )}
      {booking.status === "confirmed" && (
        <button
          onClick={() => act(startRentalAction)}
          disabled={isPending}
          className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          Start Rental
        </button>
      )}
      {booking.status === "in_progress" && (
        <button
          onClick={() => act(completeRentalAction)}
          disabled={isPending}
          className="px-4 py-1.5 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
          Mark Complete
        </button>
      )}
    </div>
  );
}
