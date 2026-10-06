"use client";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";

export default function OrderStatusClient({ id, initialData }) {
  const { data: order, error } = useSWR(
    `/api/orders/${id}`,
    fetcher,
    {
      fallbackData: initialData,
      refreshInterval: 5000,
    }
  );

  if (error) return <p className="text-red-400">Failed to load order.</p>;
  if (!order) return <p className="text-neutral-400">Loading…</p>;

  return (
    <div className="space-y-4">
      <p className="text-neutral-400">
        Status: <span className="text-amber-400">{order.status}</span>
      </p>
      <p className="text-neutral-400">
        Customer: <span className="text-neutral-100">{order.customerName}</span>
      </p>
      <p className="text-neutral-400">
        Total: <span className="text-amber-400">{order.total ?? "—"} Birr</span>
      </p>
    </div>
  );
}