"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { suspendUserAction, activateUserAction } from "@/app/actions";

export default function AdminUserActions({ userId, currentStatus, isCurrentUser }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (isCurrentUser) return <span className="text-xs text-neutral-400">You</span>;

  const act = (fn) => {
    startTransition(async () => {
      await fn(userId);
      router.refresh();
    });
  };

  return currentStatus === "active" ? (
    <button onClick={() => act(suspendUserAction)} disabled={isPending}
      className="px-4 py-1.5 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors">
      Suspend
    </button>
  ) : (
    <button onClick={() => act(activateUserAction)} disabled={isPending}
      className="px-4 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
      Activate
    </button>
  );
}
