import Link from "next/link";

export default function Pagination({ current, total, query = "" }) {
  if (total <= 1) return null;

  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <nav className="flex justify-center gap-2 mt-8">
      {current > 1 && (
        <Link
          href={`/menu?${query}page=${current - 1}`}
          className="px-3 py-1 border border-neutral-700 rounded text-neutral-300 hover:border-amber-400 hover:text-amber-400 transition-colors"
        >
          ← Prev
        </Link>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={`/menu?${query}page=${p}`}
          className={
            p === current
              ? "px-3 py-1 rounded bg-amber-400 text-neutral-900 font-semibold"
              : "px-3 py-1 border border-neutral-700 rounded text-neutral-300 hover:border-amber-400 hover:text-amber-400 transition-colors"
          }
        >
          {p}
        </Link>
      ))}

      {current < total && (
        <Link
          href={`/menu?${query}page=${current + 1}`}
          className="px-3 py-1 border border-neutral-700 rounded text-neutral-300 hover:border-amber-400 hover:text-amber-400 transition-colors"
        >
          Next →
        </Link>
      )}
    </nav>
  );
}