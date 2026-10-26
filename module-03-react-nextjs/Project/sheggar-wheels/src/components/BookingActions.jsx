"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cancelBookingAction, submitReviewAction } from "@/app/actions";
import { formatDate } from "@/lib/format-date";
import { Star, CheckCircle, XCircle } from "lucide-react";

export default function BookingActions({ booking, existingReview }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const canCancel = ["requested", "confirmed"].includes(booking.status);
  const canReview = booking.status === "completed";

  const handleCancel = () => {
    if (!confirm("Cancel this booking?")) return;
    setError("");
    startTransition(async () => {
      const result = await cancelBookingAction(booking.id);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess("Booking cancelled.");
        router.refresh();
      }
    });
  };

  const handleReview = () => {
    setError("");
    startTransition(async () => {
      const result = await submitReviewAction(booking.id, rating, comment);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess("Review submitted. Thank you!");
        setReviewOpen(false);
        router.refresh();
      }
    });
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-600 shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {canCancel && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isPending}
            className="px-5 py-2.5 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-xl hover:bg-red-100 disabled:opacity-50 transition-colors"
          >
            {isPending ? "Cancelling…" : "Cancel Booking"}
          </button>
        )}
        {canReview && !existingReview && (
          <button
            type="button"
            onClick={() => setReviewOpen((v) => !v)}
            className="px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
          >
            {reviewOpen ? "Hide Review Form" : "Leave a Review"}
          </button>
        )}
        <Link href="/cars" className="px-5 py-2.5 border border-neutral-200 rounded-xl text-neutral-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
          Browse More
        </Link>
      </div>

      {/* Existing review */}
      {existingReview && (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-2xl">
          <h3 className="font-bold mb-2 text-green-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Your Review
          </h3>
          <div className="flex items-center gap-1 mb-2">
            {[1,2,3,4,5].map((n) => (
              <Star key={n} className={`w-5 h-5 ${n <= existingReview.rating ? "fill-orange-400 text-orange-400" : "text-neutral-300"}`} />
            ))}
            <span className="text-xs text-green-800 ml-2">{formatDate(existingReview.createdAt.slice(0, 10))}</span>
          </div>
          {existingReview.comment && <p className="text-sm text-green-900">{existingReview.comment}</p>}
          {existingReview.ownerReply && (
            <div className="mt-3 pl-3 border-l-2 border-green-300">
              <p className="text-xs text-green-700 uppercase tracking-wider mb-1">Owner replied</p>
              <p className="text-sm text-green-900">{existingReview.ownerReply}</p>
            </div>
          )}
        </div>
      )}

      {/* Review form */}
      {reviewOpen && canReview && !existingReview && (
        <div className="mt-6 p-6 bg-neutral-50 border border-neutral-200 rounded-2xl">
          <h3 className="font-bold mb-3">Leave a Review</h3>
          <div className="flex items-center gap-1 mb-4">
            {[1,2,3,4,5].map((n) => (
              <button key={n} type="button" onClick={() => setRating(n)} className="p-1" aria-label={`${n} star${n > 1 ? "s" : ""}`}>
                <Star className={`w-7 h-7 transition-colors ${n <= rating ? "fill-orange-400 text-orange-400" : "text-neutral-300"}`} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="How was your trip?"
            className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 resize-none"
          />
          <button
            type="button"
            onClick={handleReview}
            disabled={isPending}
            className="mt-3 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? "Submitting…" : "Submit Review"}
          </button>
        </div>
      )}
    </div>
  );
}
