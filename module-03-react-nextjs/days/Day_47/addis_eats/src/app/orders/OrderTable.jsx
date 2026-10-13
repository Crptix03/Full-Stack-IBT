import Link from "next/link";
import CancelOrderButton from "./CancelOrderButton";

export default function OrderTable({ orders, sortedBy, sortDir }) {
  if (!orders || orders.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto border border-neutral-800 rounded-xl">
      <table className="w-full text-sm">
        <caption className="sr-only">
          Your orders, sorted by {sortedBy}{" "}
          {sortDir === "desc" ? "descending" : "ascending"}
        </caption>

        <thead>
          <tr className="border-b border-neutral-800 bg-neutral-900/40">
            <SortableHeader column="id" label="Order" current={sortedBy} dir={sortDir} align="left" />
            <SortableHeader column="date" label="Date" current={sortedBy} dir={sortDir} align="left" />
            <SortableHeader column="items" label="Items" current={sortedBy} dir={sortDir} align="right" />
            <SortableHeader column="total" label="Total (ETB)" current={sortedBy} dir={sortDir} align="right" />
            <SortableHeader column="status" label="Status" current={sortedBy} dir={sortDir} align="left" />
            <th scope="col" className="py-3 px-4 text-right text-xs uppercase tracking-wider text-neutral-500 font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => {
            const canCancel =
              order.status === "pending" || order.status === "preparing";

            return (
              <tr
                key={order.id}
                className="border-b border-neutral-900 last:border-b-0 hover:bg-neutral-900/30 transition-colors"
              >
                <td className="py-3 px-4 text-neutral-100 font-medium">
                  #{order.id.slice(-6)}
                </td>
                <td className="py-3 px-4 text-neutral-400">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </td>
                <td className="py-3 px-4 text-right text-neutral-300 tabular-nums">
                  {order.items?.length || 0}
                </td>
                <td className="py-3 px-4 text-right text-amber-400 font-medium tabular-nums">
                  {(order.total ?? 0).toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <StatusPill status={order.status} />
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    {canCancel && (
                      <CancelOrderButton orderId={order.id} compact />
                    )}
                    <Link
                      href={`/track/${order.id}`}
                      className="text-amber-400 text-xs hover:underline"
                    >
                      Track →
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SortableHeader({ column, label, current, dir, align }) {
  const isActive = current === column;
  const nextDir = isActive && dir === "asc" ? "desc" : "asc";
  const href = `/orders?sort=${column}&dir=${nextDir}`;

  const ariaSort = isActive
    ? dir === "asc"
      ? "ascending"
      : "descending"
    : "none";

  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className={`py-3 px-4 text-xs uppercase tracking-wider font-medium ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      <Link
        href={href}
        className={`inline-flex items-center gap-1 hover:text-amber-400 transition-colors ${
          isActive ? "text-amber-400" : "text-neutral-500"
        }`}
      >
        {label}
        {isActive && <span aria-hidden="true">{dir === "asc" ? "↑" : "↓"}</span>}
      </Link>
    </th>
  );
}

function StatusPill({ status }) {
  const style =
    status === "pending"
      ? "bg-amber-900 text-amber-400"
      : status === "preparing"
      ? "bg-blue-900/50 text-blue-300"
      : status === "on_the_way"
      ? "bg-purple-900/50 text-purple-300"
      : status === "delivered"
      ? "bg-green-900/50 text-green-400"
      : status === "cancelled"
      ? "bg-red-900/50 text-red-400"
      : "bg-neutral-800 text-neutral-400";

  return (
    <span className={`text-xs font-bold px-2 py-1 rounded ${style}`}>
      {status?.toUpperCase().replace("_", " ")}
    </span>
  );
}