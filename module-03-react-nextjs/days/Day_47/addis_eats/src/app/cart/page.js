"use client";

import Link from "next/link";
import { useCart } from "@/lib/context";

export default function CartPage() {
  const { items, addToCart, removeFromCart } = useCart();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="font-serif text-4xl text-amber-400 mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-neutral-400 mb-8 max-w-md mx-auto">
          Looks like you haven&apos;t added anything yet. Browse our menu
          and find something you&apos;ll love.
        </p>
        <Link
          href="/menu"
          className="inline-block px-8 py-3 bg-amber-400 text-neutral-900 font-semibold rounded-lg hover:bg-amber-300 transition-colors"
        >
          Browse the Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-serif text-3xl text-amber-400 mb-8">Your Cart</h1>

      <ul className="space-y-3 mb-8">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center p-4 bg-neutral-900/40 border border-neutral-800 rounded-lg"
          >
            <div className="min-w-0">
              <p className="text-neutral-100 font-medium truncate">
                {item.name}
              </p>
              <p className="text-sm text-neutral-500">
                {item.price} Birr each
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => removeFromCart(item.id)}
                className="text-xs text-neutral-500 hover:text-red-400 transition-colors"
              >
                Remove
              </button>

              <button
                type="button"
                onClick={() => addToCart(item)}
                className="w-7 h-7 text-neutral-400 hover:text-amber-400 border border-neutral-800 rounded transition-colors"
                aria-label="Add one more"
              >
                +
              </button>

              <span className="text-neutral-400 text-sm w-8 text-center">
                × {item.qty}
              </span>

              <span className="text-amber-400 font-semibold w-24 text-right">
                {item.price * item.qty} Birr
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center mb-8 pb-4 border-b border-neutral-800">
        <span className="text-neutral-400">Total</span>
        <span className="font-serif text-2xl text-amber-400">
          {total} Birr
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/menu"
          className="px-6 py-3 border border-neutral-700 text-neutral-200 rounded-lg text-center hover:border-amber-400 hover:text-amber-400 transition-colors"
        >
          ← Continue Shopping
        </Link>
        <Link
          href="/checkout"
          className="flex-1 px-6 py-3 bg-amber-400 text-neutral-900 font-semibold rounded-lg text-center hover:bg-amber-300 transition-colors"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}