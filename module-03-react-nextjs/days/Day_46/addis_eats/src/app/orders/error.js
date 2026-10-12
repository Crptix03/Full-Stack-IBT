"use client";

// Error boundary for the /orders segment.
// Next.js catches any throw in the page or its children and renders this.

export default function OrdersError({ error, reset }) {
  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      <div className="text-6xl mb-6">⚠️</div>

      <h1 className="font-serif text-3xl text-amber-400 mb-4">
        Something went wrong
      </h1>

      <p className="text-neutral-400 mb-2 max-w-md mx-auto">
        We couldn&apos;t load your orders.
      </p>

      {/* Show the actual error message if it's useful */}
      {error?.message && (
        <p className="text-neutral-500 text-xs mb-8 max-w-md mx-auto break-words">
          {error.message}
        </p>
      )}

      <div className="flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          onClick={() => reset()}
          className="px-6 py-2.5 bg-amber-400 text-neutral-900 font-semibold rounded-lg hover:bg-amber-300 transition-colors"
        >
          Try again
        </button>
        <a
          href="/menu"
          className="px-6 py-2.5 border border-neutral-700 text-neutral-200 rounded-lg hover:border-amber-400 hover:text-amber-400 transition-colors"
        >
          Back to Menu
        </a>
      </div>
    </div>
  );
}