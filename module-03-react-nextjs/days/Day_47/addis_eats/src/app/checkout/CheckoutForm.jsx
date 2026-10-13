"use client";

import { useActionState } from "react";
import { useCart } from "@/lib/context";
import { placeOrder } from "@/app/actions";
import Link from "next/link";

export default function CheckoutForm() {
  const { items } = useCart();
  const [state, formAction, isPending] = useActionState(placeOrder, null);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="text-6xl mb-6">🥘</div>
        <h1 className="font-serif text-4xl text-amber-400 mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-neutral-400 mb-8 max-w-md mx-auto">
          Add some dishes to your cart before checking out.
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
    <div className="max-w-2xl mx-auto">
      <h1 className="font-serif text-3xl text-amber-400 mb-8">Checkout</h1>

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="items" value={JSON.stringify(items)} />

        <div>
          <label className="block text-sm text-neutral-400 mb-1">
            Your Name
          </label>
          <input
            type="text"
            name="customerName"
            className="w-full bg-neutral-900 border border-neutral-700 text-neutral-100 px-3 py-2 rounded focus:outline-none focus:border-amber-400"
          />
          {state?.fieldErrors?.customerName && (
            <p className="text-red-400 text-xs mt-1">
              {state.fieldErrors.customerName[0]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-neutral-400 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="+251 9XX XXX XXX"
            className="w-full bg-neutral-900 border border-neutral-700 text-neutral-100 px-3 py-2 rounded focus:outline-none focus:border-amber-400"
          />
          {state?.fieldErrors?.phone && (
            <p className="text-red-400 text-xs mt-1">
              {state.fieldErrors.phone[0]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-neutral-400 mb-1">
            Delivery Address
          </label>
          <input
            type="text"
            name="address"
            className="w-full bg-neutral-900 border border-neutral-700 text-neutral-100 px-3 py-2 rounded focus:outline-none focus:border-amber-400"
          />
          {state?.fieldErrors?.address && (
            <p className="text-red-400 text-xs mt-1">
              {state.fieldErrors.address[0]}
            </p>
          )}
        </div>

        {/* ── Notes for the kitchen ───────────── */}
        <div>
          <label className="block text-sm text-neutral-400 mb-1">
            Order Notes{" "}
            <span className="text-neutral-500">(optional)</span>
          </label>
          <textarea
            name="notes"
            rows={3}
            maxLength={300}
            placeholder="Allergies, special requests, delivery instructions…"
            className="w-full bg-neutral-900 border border-neutral-700 text-neutral-100 px-3 py-2 rounded focus:outline-none focus:border-amber-400 resize-none"
          />
          {state?.fieldErrors?.notes && (
            <p className="text-red-400 text-xs mt-1">
              {state.fieldErrors.notes[0]}
            </p>
          )}
        </div>

        {/* Order summary */}
        <div className="border border-neutral-800 rounded-lg p-4 bg-neutral-900/40">
          <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-3">
            Order Summary
          </h2>
          <ul className="space-y-2 mb-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between text-sm text-neutral-400"
              >
                <span>
                  {item.qty}× {item.name}
                </span>
                <span>{item.price * item.qty} Birr</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center pt-3 border-t border-neutral-800">
            <span className="text-neutral-400">Total</span>
            <span className="font-serif text-xl text-amber-400">
              {total} Birr
            </span>
          </div>
        </div>

        {state?.error && (
          <p className="text-red-400 text-sm">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 bg-amber-400 text-neutral-900 font-semibold rounded-lg hover:bg-amber-300 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Placing Order…" : "Place Order"}
        </button>
      </form>
    </div>
  );
}