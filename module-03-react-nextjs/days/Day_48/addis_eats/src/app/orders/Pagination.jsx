import Link from "next/link";

// Real links, not buttons. This gives you:
//  - the browser back button
//  - middle-click / open in new tab
//  - a crawler that can follow pagination
// The URL keeps the current sort so paging doesn't lose it.

export default function Pagination({ current, total, sort, dir }) {
  if (total <= 1) return null;

  // Build the base query string once.
  const base = new URLSearchParams();
  if (sort) base.set("sort", sort);
  if (dir) base.set("dir", dir);
  const baseStr = base.toString();

  const buildHref = (page) => {
    const params = new URLSearchParams(base);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return `/orders${qs ? `?${qs}` : ""}`;
  };

  // Show a small window around the current page instead of every page.
  const windowSize = 2;
  const pages = [];
  for (let p = 1; p <= total; p++) {
    if (
      p === 1 ||
      p === total ||
      Math.abs(p - current) <= windowSize
    ) {
      pages.push(p);
    }
  }

  // Insert "…" markers where pages were skipped.
  const withDots = [];
  for (let i = 0; i < pages.length; i++) {
    withDots.push(pages[i]);
    if (i < pages.length - 1 && pages[i + 1] - pages[i] > 1) {
      withDots.push("…");
    }
  }

  return (
    <nav
      aria-label="Order history pagination"
      className="flex justify-center items-center gap-2 mt-8"
    >
      {/* Prev */}
      {current > 1 ? (
        <Link
          href={buildHref(current - 1)}
          className="px-3 py-1.5 text-xs border border-neutral-700 rounded text-neutral-300 hover:border-amber-400 hover:text-amber-400 transition-colors"
        >
          ← Prev
        </Link>
      ) : (
        <span className="px-3 py-1.5 text-xs border border-neutral-900 rounded text-neutral-700 cursor-not-allowed">
          ← Prev
        </span>
      )}

      {/* Numbered pages */}
      {withDots.map((p, i) =>
        p === "…" ? (
          <span key={`dots-${i}`} className="px-2 text-neutral-600 text-xs">
            …
          </span>
        ) : p === current ? (
          <span
            key={p}
            aria-current="page"
            className="px-3 py-1.5 text-xs rounded bg-amber-400 text-neutral-900 font-semibold"
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className="px-3 py-1.5 text-xs border border-neutral-700 rounded text-neutral-300 hover:border-amber-400 hover:text-amber-400 transition-colors"
          >
            {p}
          </Link>
        )
      )}

      {/* Next */}
      {current < total ? (
        <Link
          href={buildHref(current + 1)}
          className="px-3 py-1.5 text-xs border border-neutral-700 rounded text-neutral-300 hover:border-amber-400 hover:text-amber-400 transition-colors"
        >
          Next →
        </Link>
      ) : (
        <span className="px-3 py-1.5 text-xs border border-neutral-900 rounded text-neutral-700 cursor-not-allowed">
          Next →
        </span>
      )}
    </nav>
  );
}