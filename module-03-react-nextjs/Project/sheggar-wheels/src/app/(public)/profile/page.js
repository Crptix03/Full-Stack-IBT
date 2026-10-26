import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { findUserById } from "@/lib/users";
import { db } from "@/lib/db";
import { etb } from "@/lib/format";
import { formatDate } from "@/lib/format-date";
import {
  User,
  Mail,
  Phone,
  Shield,
  Car,
  Calendar,
  Wallet,
  Star,
  ChevronRight,
} from "lucide-react";

export const metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/signin?next=/profile");

  const user = findUserById(session.userId);
  if (!user) redirect("/signin");

  // Stats
  const myBookings = db.bookings.filter((b) => b.renterId === session.userId);
  const myCars     = db.cars.filter((c) => c.ownerId === session.userId);
  const myReviews  = db.reviews.filter((r) => r.renterId === session.userId);
  const totalSpent = myBookings
    .filter((b) => b.paymentStatus === "paid" && !["cancelled","declined"].includes(b.status))
    .reduce((s, b) => s + b.total, 0);
  const completedTrips = myBookings.filter((b) =>
    ["completed", "reviewed"].includes(b.status)
  ).length;

  // Role badge colour
  const roleBadge = (role) => {
    if (role === "admin")  return "bg-red-100 text-red-700";
    if (role === "owner")  return "bg-indigo-100 text-indigo-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black mb-8">My Profile</h1>

      {/* ── Identity card ───────────────────────────────── */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-8 mb-6">
        <div className="flex items-start gap-6">
          {/* Avatar initials */}
          <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0">
            <span className="text-3xl font-black text-white">
              {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-black text-neutral-900 mb-1">{user.name}</h2>

            {/* Role badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {user.roles.map((role) => (
                <span
                  key={role}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${roleBadge(role)}`}
                >
                  {role}
                </span>
              ))}
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                user.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {user.status}
              </span>
            </div>

            {/* Contact info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                {user.email}
              </div>
              {user.phone && (
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                  {user.phone}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Calendar className="w-4 h-4 text-neutral-400 shrink-0" />
                Member since {formatDate(user.createdAt.slice(0, 10))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Renter stats ─────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={<Calendar className="w-5 h-5" />}
          label="Total Bookings"
          value={myBookings.length}
          color="indigo"
        />
        <StatCard
          icon={<Car className="w-5 h-5" />}
          label="Completed Trips"
          value={completedTrips}
          color="green"
        />
        <StatCard
          icon={<Star className="w-5 h-5" />}
          label="Reviews Left"
          value={myReviews.length}
          color="orange"
        />
        <StatCard
          icon={<Wallet className="w-5 h-5" />}
          label="Total Spent"
          value={etb.format(totalSpent)}
          color="purple"
          wide
        />
        {user.roles.includes("owner") && (
          <StatCard
            icon={<Car className="w-5 h-5" />}
            label="Cars Listed"
            value={myCars.length}
            color="indigo"
          />
        )}
      </div>

      {/* ── Quick links ──────────────────────────────────── */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-neutral-100">
          <h3 className="font-bold text-neutral-900">Quick Links</h3>
        </div>
        <ul className="divide-y divide-neutral-100">
          <QuickLink href="/bookings" label="My Bookings" icon={<Calendar className="w-4 h-4" />} />
          <QuickLink href="/dashboard" label="Renter Dashboard" icon={<User className="w-4 h-4" />} />
          {user.roles.includes("owner") && (
            <>
              <QuickLink href="/owner" label="Owner Dashboard" icon={<Car className="w-4 h-4" />} />
              <QuickLink href="/owner/earnings" label="My Earnings" icon={<Wallet className="w-4 h-4" />} />
            </>
          )}
          {user.roles.includes("admin") && (
            <QuickLink href="/admin" label="Admin Panel" icon={<Shield className="w-4 h-4" />} />
          )}
        </ul>
      </div>

      {/* ── Security note ────────────────────────────────── */}
      <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-2xl">
        <div className="flex items-start gap-3">
          <Shield className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-neutral-600 mb-1">Demo Account</p>
            <p className="text-xs text-neutral-500 leading-relaxed">
              This is a demo project. No real cars, no real payments, no real bookings.
              Account ID: <span className="font-mono">{user.id}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, wide = false }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    green:  "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-500",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className={`p-5 bg-white border border-neutral-200 rounded-2xl ${wide ? "col-span-2 sm:col-span-1" : ""}`}>
      <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl mb-3 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">{label}</p>
      <p className="text-2xl font-black text-neutral-900">{value}</p>
    </div>
  );
}

function QuickLink({ href, label, icon }) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-3 px-6 py-4 hover:bg-neutral-50 transition-colors"
      >
        <span className="text-indigo-600">{icon}</span>
        <span className="flex-1 text-sm font-medium text-neutral-700">{label}</span>
        <ChevronRight className="w-4 h-4 text-neutral-400" />
      </Link>
    </li>
  );
}
