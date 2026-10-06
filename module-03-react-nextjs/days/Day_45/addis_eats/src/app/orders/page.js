import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getOrdersFor } from "@/lib/orders";

export const metadata = {
  title: "My Orders",
  description: "View your past orders.",
};

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/signin?next=/orders");

  // Layer 3: scoped query — only the signed-in user's orders.
  const userOrders = getOrdersFor(session.userId);

  if (userOrders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="text-6xl mb-6">📦</div>
        <h1 className="font-serif text-4xl text-amber-400 mb-4">
          No Orders Yet
        </h1>
        <p className="text-neutral-400 mb-8 max-w-md mx-auto">
          When you place an order, it will show up here so you can track
          its status and view your past meals.
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
      <h1 className="font-serif text-3xl text-amber-400 mb-8">My Orders</h1>

      <ul className="space-y-3">
        {userOrders.map((order) => (
          <li
            key={order.id}
            className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-amber-400/50 transition-colors"
          >
            <Link
              href={`/orders/${order.id}`}
              className="flex justify-between items-start gap-4"
            >
              <div className="min-w-0">
                <p className="text-neutral-100 font-medium">
                  Order #{order.id.slice(-6)}
                </p>
                <p className="text-sm text-neutral-400 mt-0.5">
                  {order.items?.length || 0} item
                  {order.items?.length === 1 ? "" : "s"} ·{" "}
                  {order.total ?? "—"} Birr
                </p>
                {order.createdAt && (
                  <p className="text-xs text-neutral-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>

              <span
                className={`shrink-0 text-xs font-bold px-3 py-1 rounded ${
                  order.status === "pending"
                    ? "bg-amber-900 text-amber-400"
                    : order.status === "preparing"
                    ? "bg-blue-900/50 text-blue-300"
                    : order.status === "cancelled"
                    ? "bg-red-900/50 text-red-400"
                    : order.status === "delivered"
                    ? "bg-green-900/50 text-green-400"
                    : "bg-neutral-800 text-neutral-400"
                }`}
              >
                {order.status?.toUpperCase()}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}