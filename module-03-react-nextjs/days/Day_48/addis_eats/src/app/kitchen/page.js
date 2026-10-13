import { getSession } from "@/lib/session";
import { getAllOrders } from "@/lib/orders";
import { redirect } from "next/navigation";
import StatusButton from "./StatusButton";

export const metadata = {
  title: "Kitchen",
  description: "Staff dashboard.",
};

export default async function KitchenPage() {
  const session = await getSession();

  if (!session || session.role !== "staff") {
    redirect("/unauthorized");
  }

  const orders = getAllOrders();
  const pending = orders.filter((o) => o.status === "pending").length;
  const preparing = orders.filter((o) => o.status === "preparing").length;

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-3xl text-amber-400 mb-2">
        Kitchen Dashboard
      </h1>
      <p className="text-neutral-400 mb-8">
        Live order queue — updates propagate to customers automatically.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Stat label="Total" value={orders.length} />
        <Stat label="Pending" value={pending} accent />
        <Stat label="Preparing" value={preparing} />
        <Stat
          label="Delivered"
          value={orders.filter((o) => o.status === "delivered").length}
        />
      </div>

      {orders.length === 0 ? (
        <p className="text-neutral-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 bg-neutral-900 border border-neutral-800 rounded-lg"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-neutral-100 font-semibold">
                    Order #{order.id.slice(-6)}
                  </p>
                  <p className="text-sm text-neutral-400">
                    {order.customerName} — {order.items?.length || 0} items —{" "}
                    {order.total ?? "—"} Birr
                  </p>
                  {order.address && (
                    <p className="text-xs text-neutral-500 mt-1">
                      {order.address}
                    </p>
                  )}
                  {order.phone && (
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {order.phone}
                    </p>
                  )}
                </div>
                <StatusPill status={order.status} />
              </div>

              {order.notes && (
                <div className="my-3 p-3 bg-amber-950/30 border border-amber-900/40 rounded">
                  <p className="text-xs uppercase tracking-wider text-amber-500 mb-1">
                    Customer Note
                  </p>
                  <p className="text-sm text-amber-100 italic">
                    &ldquo;{order.notes}&rdquo;
                  </p>
                </div>
              )}

              <StatusButton
                orderId={order.id}
                currentStatus={order.status}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="border border-neutral-800 rounded-lg p-4 bg-neutral-900/40">
      <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
        {label}
      </p>
      <p
        className={`text-2xl font-serif ${
          accent ? "text-amber-400" : "text-neutral-100"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function StatusPill({ status }) {
  const style =
    status === "pending"
      ? "bg-amber-900 text-amber-400"
      : status === "preparing"
      ? "bg-blue-900/50 text-blue-300"
      : status === "delivered"
      ? "bg-green-900/50 text-green-400"
      : status === "cancelled"
      ? "bg-red-900/50 text-red-400"
      : "bg-neutral-800 text-neutral-400";

  return (
    <span className={`text-xs font-bold px-3 py-1 rounded ${style}`}>
      {status.toUpperCase()}
    </span>
  );
}