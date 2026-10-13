"use client";

import { useCart } from "@/lib/context";

export default function CartBadge() {
  const { items } = useCart();
  const count = items.reduce((sum, item) => sum + item.qty, 0);

  if (count === 0) return null;

  return (
    <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold bg-amber-400 text-neutral-900 rounded-full">
      {count}
    </span>
  );
}