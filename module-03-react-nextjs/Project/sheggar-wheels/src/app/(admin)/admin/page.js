import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { etb } from "@/lib/format";
import { Users, Car as CarIcon, Calendar, Wallet, ArrowRight } from "lucide-react";

export const metadata = { title: "Admin Overview" };

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/");

  const users = db.users;
  const cars = db.cars;
  const bookings = db.bookings;

  const pendingCars = cars.filter((c) => c.status === "pending");
  const approvedCars = cars.filter((c) => c.status === "approved");
  const revenue = bookings
    .filter((b) => ["completed", "reviewed"].includes(b.status))
    .reduce((sum, b) => sum + b.fee, 0);
  const totalVolume = bookings
    .filter((b) => ["completed", "reviewed"].includes(b.status))
    .reduce((sum, b) => sum + b.total, 0);

  const stats = {
    users: users.length,
    activeUsers: users.filter((u) => u.status === "active").length,
    pendingCars: pendingCars.length,
    approvedCars: approvedCars.length,
    totalBookings: bookings.length,
    platformRevenue: revenue,
    totalVolume,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-1">Admin Overview</h1>
        <p className="text-neutral-500 text-sm">Platform metrics and moderation.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat icon={<Users className="w-5 h-5" />} label="Users" value={stats.users} color="indigo" />
        <Stat icon={<CarIcon className="w-5 h-5" />} label="Approved cars" value={stats.approvedCars} color="green" />
        <Stat icon={<Calendar className="w-5 h-5" />} label="Bookings" value={stats.totalBookings} color="purple" />
        <Stat icon={<Wallet className="w-5 h-5" />} label="Platform fees" value={etb.format(stats.platformRevenue)} color="orange" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActionCard
          href="/admin/listings"
          title="Moderate Listings"
          description={`${stats.pendingCars} pending car${stats.pendingCars === 1 ? "" : "s"} awaiting approval`}
          badge={stats.pendingCars > 0 ? stats.pendingCars : null}
        />
        <ActionCard
          href="/admin/users"
          title="Manage Users"
          description={`${stats.activeUsers} active, ${stats.users - stats.activeUsers} suspended`}
        />
        <ActionCard
          href="/admin/bookings"
          title="All Bookings"
          description={`${stats.totalBookings} total · ${etb.format(stats.totalVolume)} in volume`}
        />
      </div>
    </div>
  );
}

function Stat({ icon, label, value, color }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="p-5 bg-white border border-neutral-200 rounded-2xl">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${colors[color]}`}>{icon}</div>
      <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">{label}</p>
      <p className="text-2xl font-black text-neutral-900">{value}</p>
    </div>
  );
}

function ActionCard({ href, title, description, badge }) {
  return (
    <Link href={href} className="group block p-6 bg-white border border-neutral-200 rounded-2xl hover:border-indigo-400 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg group-hover:text-indigo-600 transition-colors">{title}</h3>
        {badge && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">{badge}</span>
        )}
      </div>
      <p className="text-sm text-neutral-500 mb-4">{description}</p>
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:gap-2 transition-all">
        Open <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  );
}
