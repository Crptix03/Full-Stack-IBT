"use client";

import { useRouter, useSearchParams } from "next/navigation";

const STORAGE_KEY = "addis-eats-favorites";

function readFavorites() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function CategoryBar({ categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const activeFavs = searchParams.get("favs") || "";
  const favoritesActive = activeFavs !== "";

  const handleSelect = (slug) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page");

    if (slug === "all") {
      params.delete("category");
      params.delete("favs");
    } else if (slug === "favorites") {
      const favs = readFavorites();
      if (favs.length === 0) {
        // Nothing favorited — do nothing rather than showing an empty list.
        return;
      }
      params.delete("category");
      params.set("favs", favs.join(","));
    } else {
      params.delete("favs");
      params.set("category", slug);
    }

    const qs = params.toString();
    router.push(`/menu${qs ? `?${qs}` : ""}`);
  };

  return (
    <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 -mx-1 px-1">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.slug && !favoritesActive;
        return (
          <button
            key={cat.slug}
            type="button"
            onClick={() => handleSelect(cat.slug)}
            className={`shrink-0 whitespace-nowrap text-left px-4 py-2 rounded border text-sm transition-colors min-h-[44px] ${
              isActive
                ? "bg-amber-400 border-amber-400 text-neutral-900 font-medium"
                : "bg-transparent border-neutral-700 text-neutral-200 hover:border-amber-400 hover:text-amber-400"
            }`}
          >
            {cat.label}
          </button>
        );
      })}

      {/* Favorites chip — separated from categories */}
      <div className="hidden md:block md:mt-3 md:pt-3 md:border-t md:border-neutral-800" />

      <button
        type="button"
        onClick={() => handleSelect("favorites")}
        className={`shrink-0 whitespace-nowrap text-left px-4 py-2 rounded border text-sm transition-colors min-h-[44px] inline-flex items-center gap-2 ${
          favoritesActive
            ? "bg-red-500 border-red-500 text-white font-medium"
            : "bg-transparent border-neutral-700 text-neutral-200 hover:border-red-400 hover:text-red-400"
        }`}
      >
        <HeartIcon filled={favoritesActive} />
        Favorites
      </button>
    </div>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}