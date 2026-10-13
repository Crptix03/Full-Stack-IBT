"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "addis-eats-favorites";

function readFavorites() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeFavorites(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {}
}

export default function FavoriteButton({ dishId, dishName }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsFavorite(readFavorites().includes(dishId));
  }, [dishId]);

  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const current = readFavorites();
    const next = current.includes(dishId)
      ? current.filter((id) => id !== dishId)
      : [...current, dishId];

    writeFavorites(next);
    setIsFavorite(next.includes(dishId));
  };

  // Placeholder while not mounted (SSR-safe)
  if (!mounted) {
    return (
      <span
        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-neutral-900/80 border border-neutral-800"
        aria-hidden
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        isFavorite
          ? `Remove ${dishName} from favorites`
          : `Add ${dishName} to favorites`
      }
      aria-pressed={isFavorite}
      className={`absolute top-3 right-3 w-11 h-11 rounded-full flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${
        isFavorite
          ? "bg-red-500/90 text-white hover:bg-red-500"
          : "bg-neutral-900/80 text-neutral-300 border border-neutral-700 hover:text-red-400 hover:border-red-400/50"
      }`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}