import { getSession } from "@/lib/session";
import { orders } from "@/lib/orders";
import { redirect } from "next/navigation";

export default async function KitchenPage() {
  const session = await getSession();

  // Middleware should already protect this, but we double-check for safety.
  // This is Layer 3: Server-side role check.
  if (!session || session.role !== "staff") {
    redirect("/"); // Send non-staff to home
  }

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-3xl text-amber-400 mb-6">
        Kitchen Dashboard
      </h1>
      <p className="text-neutral-400 mb-8">
        Welcome, Chef. Here are the current orders.
      </p>

      {orders.length === 0 ? (
        <p className="text-neutral-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="text-neutral-100 font-semibold">
                  Order #{order.id.slice(-6)}
                </p>
                <p className="text-sm text-neutral-400">
                  {order.customerName} — {order.items.length} items
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded ${
                    order.status === "pending"
                      ? "bg-amber-900 text-amber-400"
                      : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}