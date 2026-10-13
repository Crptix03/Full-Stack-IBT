"use client";

import { useCart } from "@/lib/context";
import { useState } from "react";

export default function AddToCartButton({ dish, compact = false }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addToCart(dish);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Compact: full-width button for cards. Full: padded button for detail page.
  const sizeClass = compact ? "w-full py-2 text-sm" : "px-6 py-3";

  // Compact button sits inside a card with focus-within ring — so no
  // own outline (avoids double ring). Full button has no parent ring,
  // so it draws its own.
  const focusClass = compact
    ? "focus-visible:outline-none"
    : "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-live="polite"
      className={`${sizeClass} bg-amber-400 text-neutral-900 font-semibold rounded hover:bg-amber-500 transition-colors inline-flex items-center justify-center gap-1.5 ${focusClass}`}
    >
      {added ? (
        <>
          <span aria-hidden="true">✓</span> Added
        </>
      ) : (
        <>
          <span aria-hidden="true">+</span> Add to Cart
        </>
      )}
    </button>
  );
}