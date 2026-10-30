"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

export default function BookingDetailError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-orange-100 text-orange-500 mb-6">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <h1 className="text-2xl font-black text-neutral-900 mb-3">
        Failed to Load Booking
      </h1>
      <p className="text-neutral-500 leading-relaxed mb-8">
        Something went wrong loading this booking. Please try again.
      </p>
      {process.env.NODE_ENV === "development" && error?.message && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-left">
          <p className="text-xs font-mono text-red-700 break-all">{error.message}</p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
        <Link
          href="/bookings"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-neutral-200 text-neutral-700 font-semibold rounded-xl hover:border-indigo-400 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> My Bookings
        </Link>
      </div>
    </div>
  );
}
