"use client";

import useSWR from "swr";
import fetcher from "@/lib/fetcher";

export default function OrderStatusClient({ id, initialData }) {
  const { data: order, error } = useSWR(`/api/orders/${id}`, fetcher, {
    fallbackData: initialData,
    refreshInterval: 5000,
  });

  if (error) {
    return (
      <p className="text-red-400">
        Failed to load order. Please refresh the page.
      </p>
    );
  }

  if (!order) {
    return <p className="text-neutral-400">Loading…</p>;
  }

  const statusColor =
    order.status === "pending"
      ? "bg-amber-900 text-amber-400"
      : order.status === "preparing"
      ? "bg-blue-900/50 text-blue-300"
      : order.status === "cancelled"
      ? "bg-red-900/50 text-red-400"
      : order.status === "delivered"
      ? "bg-green-900/50 text-green-400"
      : "bg-neutral-800 text-neutral-400";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-neutral-400">Status:</span>
        <span className={`text-xs font-bold px-3 py-1 rounded ${statusColor}`}>
          {order.status?.toUpperCase()}
        </span>
        <span className="text-[10px] text-neutral-500 ml-auto">
          Auto-refreshing every 5s
        </span>
      </div>

      <p className="text-neutral-400">
        Customer:{" "}
        <span className="text-neutral-100">{order.customerName}</span>
      </p>

      <p className="text-neutral-400">
        Total:{" "}
        <span className="text-amber-400">{order.total ?? "—"} Birr</span>
      </p>

      {order.address && (
        <p className="text-neutral-400">
          Address:{" "}
          <span className="text-neutral-100">{order.address}</span>
        </p>
      )}

      {order.phone && (
        <p className="text-neutral-400">
          Phone: <span className="text-neutral-100">{order.phone}</span>
        </p>
      )}

      {order.notes && (
        <div className="pt-3 border-t border-neutral-800">
          <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
            Notes
          </p>
          <p className="text-neutral-300 text-sm italic">
            &ldquo;{order.notes}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}