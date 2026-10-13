"use client";

import Link from "next/link";
import { useCart } from "@/lib/context";

export default function CartPage() {
  const { items, addToCart, decrementFromCart, removeFromCart } = useCart();

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
          className="inline-block px-8 py-3 bg-amber-400 text-neutral-900 font-semibold rounded-lg hover:bg-amber-300 transition-colors min-h-[44px]"
        >
          Browse the Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-serif text-3xl text-amber-400 mb-6">
        Your Cart
      </h1>

      <ul className="space-y-3 mb-8">
        {items.map((item) => (
          <li
            key={item.id}
            className="p-4 bg-neutral-900/40 border border-neutral-800 rounded-lg"
          >
            {/* Row 1: name + Remove */}
            <div className="flex justify-between items-start gap-3 mb-1">
              <p className="text-neutral-100 font-medium leading-tight">
                {item.name}
              </p>
              <button
                type="button"
                onClick={() => removeFromCart(item.id)}
                className="text-xs text-neutral-500 hover:text-red-400 transition-colors shrink-0 min-h-[24px]"
                aria-label={`Remove ${item.name} from cart`}
              >
                Remove
              </button>
            </div>

            {/* Row 2: price per item */}
            <p className="text-xs text-neutral-500 mb-3">
              {item.price.toLocaleString()} Birr each
            </p>

            {/* Row 3: stepper + line total */}
            <div className="flex justify-between items-center gap-3">
              <div className="flex items-center border border-neutral-800 rounded">
                <button
                  type="button"
                  onClick={() => decrementFromCart(item.id)}
                  className="w-11 h-11 text-neutral-400 hover:text-amber-400 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-400 inline-flex items-center justify-center"
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  −
                </button>

                <span
                  className="min-w-[32px] text-center text-sm text-neutral-100 tabular-nums"
                  aria-live="polite"
                >
                  {item.qty}
                </span>

                <button
                  type="button"
                  onClick={() => addToCart(item)}
                  className="w-11 h-11 text-neutral-400 hover:text-amber-400 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-400 inline-flex items-center justify-center"
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  +
                </button>
              </div>

              <span className="text-amber-400 font-semibold tabular-nums shrink-0">
                {(item.price * item.qty).toLocaleString()} Birr
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Total row */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-800">
        <span className="text-neutral-400">Total</span>
        <span className="font-serif text-2xl text-amber-400 tabular-nums">
          {total.toLocaleString()} Birr
        </span>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/menu"
          className="px-6 py-3 border border-neutral-700 text-neutral-200 rounded-lg text-center hover:border-amber-400 hover:text-amber-400 transition-colors min-h-[44px] inline-flex items-center justify-center"
        >
          ← Continue Shopping
        </Link>
        <Link
          href="/checkout"
          className="flex-1 px-6 py-3 bg-amber-400 text-neutral-900 font-semibold rounded-lg text-center hover:bg-amber-300 transition-colors min-h-[44px] inline-flex items-center justify-center"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}