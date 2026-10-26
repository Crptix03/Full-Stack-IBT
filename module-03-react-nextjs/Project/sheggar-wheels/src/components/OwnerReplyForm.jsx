"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { replyToReviewAction } from "@/app/actions";

export default function OwnerReplyForm({ reviewId }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!reply.trim()) return;
    setError("");
    startTransition(async () => {
      const result = await replyToReviewAction(reviewId, reply.trim());
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
        onClick={() => setOpen(true)}
        className="text-sm text-indigo-600 hover:underline font-semibold"
      >
        Reply to this review
      </button>
    );
  }

  return (
    <div className="mt-2">
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        rows={2}
        placeholder="Write your reply…"
        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 resize-none"
      />
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Saving…" : "Submit Reply"}
        </button>
        <button onClick={() => setOpen(false)} className="px-4 py-2 text-neutral-600 text-sm hover:text-neutral-900">
          Cancel
        </button>
      </div>
    </div>
  );
}
