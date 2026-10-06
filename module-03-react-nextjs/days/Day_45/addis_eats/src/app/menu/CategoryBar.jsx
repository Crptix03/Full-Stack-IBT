"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function CategoryBar({ categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") || "all";

  const handleSelect = (slug) => {
    const params = new URLSearchParams(searchParams);
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    params.delete("page");
    router.push(`/menu?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-2">
      {categories.map((cat) => {
        const isActive = active === cat.slug;
        return (
          <button
            key={cat.slug}
            type="button"
            onClick={() => handleSelect(cat.slug)}
            className={`text-left px-4 py-2 rounded border text-sm transition-colors ${
              isActive
                ? "bg-amber-400 border-amber-400 text-neutral-900 font-medium"
                : "bg-transparent border-neutral-700 text-neutral-200 hover:border-amber-400 hover:text-amber-400"
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}