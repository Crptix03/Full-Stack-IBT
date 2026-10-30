"use client"; // error.js must be a Client Component

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log to an error reporting service in production
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-50">
      <div className="max-w-md w-full text-center">

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-orange-100 text-orange-500 mb-6">
          <AlertTriangle className="w-10 h-10" />
        </div>

        <h1 className="text-2xl font-black text-neutral-900 mb-3">
          Something Went Wrong
        </h1>
        <p className="text-neutral-500 leading-relaxed mb-2">
          An unexpected error occurred. This is usually temporary — try
          refreshing the page.
        </p>

        {/* Error details — only shown in development */}
        {process.env.NODE_ENV === "development" && error?.message && (
          <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-xl text-left">
            <p className="text-xs font-mono text-red-700 break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-neutral-200 text-neutral-700 font-semibold rounded-xl hover:border-indigo-400 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
