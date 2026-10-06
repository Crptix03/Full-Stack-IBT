"use client";

export default function CategoryBar({ categories, active = "All", onSelect }) {
  return (
    <div className="flex flex-col gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelect?.(cat)}
          className={`text-left px-4 py-2 rounded border text-sm transition-colors ${
            active === cat
              ? "bg-amber-400 border-amber-400 text-neutral-900 font-medium"
              : "bg-transparent border-neutral-700 text-neutral-200 hover:border-amber-400 hover:text-amber-400"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}