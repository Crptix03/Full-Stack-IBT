import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import {
  getAllOrders,
  getRevenueByArea,
  getOrdersPerDay,
  seedDemoOrders,
} from "@/lib/orders";
import RevenueChart from "./RevenueChart";
import OrdersLineChart from "./OrdersLineChart";
import DashboardTable from "./DashboardTable";
import SeedButton from "./SeedButton";

export const metadata = {
  title: "Dashboard",
  description: "Revenue and order trends for Addis Eats.",
};

export default async function DashboardPage() {
  const session = await getSession();

  // Staff-only — the same rule as /kitchen.
  if (!session || session.role !== "staff") {
    redirect("/unauthorized");
  }

  // Aggregate on the server. Only the summary crosses the client boundary.
  const allOrders = getAllOrders();
  const revenueByArea = getRevenueByArea();
  const ordersPerDay = getOrdersPerDay(14);

  const totalRevenue = revenueByArea.reduce((sum, r) => sum + r.revenue, 0);
  const totalOrders = allOrders.length;
  const avgOrder =
    totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Empty state: no orders at all yet.
  const isEmpty = totalOrders === 0;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl text-amber-400 mb-2">
            Dashboard
          </h1>
          <p className="text-neutral-400 text-sm">
            Revenue and order trends, aggregated on the server.
          </p>
        </div>
        <SeedButton />
      </div>

      {isEmpty ? (
        <EmptyState />
      ) : (
        <>
          {/* ── Stats ─────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <Stat label="Total Revenue" value={`${totalRevenue.toLocaleString()} ETB`} />
            <Stat label="Total Orders" value={totalOrders} />
            <Stat label="Avg Order Value" value={`${avgOrder.toLocaleString()} ETB`} />
          </div>

          {/* ── Revenue by Neighbourhood ─────────── */}
          <section className="mb-10">
            <h2 className="font-serif text-xl text-neutral-100 mb-1">
              Revenue by Neighbourhood
            </h2>
            <p className="text-xs text-neutral-500 mb-4">
              All orders, in ETB. Bar axis starts at zero.
            </p>
            <RevenueChart data={revenueByArea} />

            {/* Accessible fallback: the same data as a table */}
            <DashboardTable
              caption="Revenue by neighbourhood, sorted highest first"
              columns={["Neighbourhood", "Revenue (ETB)"]}
              rows={revenueByArea.map((r) => [r.area, r.revenue.toLocaleString()])}
            />
          </section>

          {/* ── Orders per Day ───────────────────── */}
          <section className="mb-10">
            <h2 className="font-serif text-xl text-neutral-100 mb-1">
              Orders per Day
            </h2>
            <p className="text-xs text-neutral-500 mb-4">
              Last 14 days. Unit: orders.
            </p>
            <OrdersLineChart data={ordersPerDay} />

            <DashboardTable
              caption="Orders per day, oldest first"
              columns={["Date", "Orders"]}
              rows={ordersPerDay.map((d) => [d.label, d.orders])}
            />
          </section>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="border border-neutral-800 rounded-xl p-5 bg-neutral-900/40">
      <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
        {label}
      </p>
      <p className="text-2xl font-serif text-amber-400">{value}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 border border-neutral-800 rounded-2xl bg-neutral-900/30">
      <div className="text-6xl mb-6">📊</div>
      <h2 className="font-serif text-2xl text-neutral-100 mb-3">
        No data yet
      </h2>
      <p className="text-neutral-400 max-w-md mx-auto mb-6 text-sm leading-relaxed">
        When orders start coming in, you&apos;ll see revenue by neighbourhood
        and daily order trends here. Click <strong>Seed demo orders</strong>{" "}
        above to populate the dashboard for a walkthrough.
      </p>
    </div>
  );
}