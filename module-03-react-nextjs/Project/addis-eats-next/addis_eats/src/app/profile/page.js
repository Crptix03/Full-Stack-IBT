import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { findUserById } from "@/lib/users";
import { getOrdersFor } from "@/lib/orders";

export const metadata = {
  title: "Profile",
  description: "Your Addis Eats account.",
};

// Resolve a display user from the session. Demo accounts come from
// users.js; Google users carry their info in the session directly.
function resolveUser(session) {
  if (!session) return null;

  if (session.provider === "google") {
    return {
      id: session.userId,
      username: session.username || "Google User",
      role: session.role || "customer",
      provider: "google",
    };
  }

  const user = findUserById(session.userId);
  if (!user) return null;
  return { ...user, provider: "demo" };
}

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/signin?next=/profile");

  const user = resolveUser(session);
  if (!user) redirect("/signin?next=/profile");

  const userOrders = getOrdersFor(session.userId);
  const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const initials = (user.username || "U").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-serif text-3xl text-amber-400 mb-8">My Profile</h1>

      {/* ── User card ───────────────────────────── */}
      <div className="border border-neutral-800 rounded-xl p-6 bg-neutral-900/40 mb-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-amber-400 text-neutral-900 font-bold text-2xl flex items-center justify-center">
            {initials}
          </div>
          <div>
            <p className="text-xl text-neutral-100 font-semibold capitalize">
              {user.username}
            </p>
            <p className="text-sm text-neutral-400">
              Role:{" "}
              <span
                className={
                  user.role === "staff"
                    ? "text-amber-400 font-semibold"
                    : "text-neutral-300"
                }
              >
                {user.role}
              </span>
            </p>
            {user.provider === "google" && (
              <p className="text-xs text-neutral-500 mt-1">
                Signed in with Google
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats ───────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Stat label="Orders Placed" value={userOrders.length} />
        <Stat
          label="Total Spent"
          value={`${totalSpent.toLocaleString()} Birr`}
        />
      </div>

      {/* ── Actions ─────────────────────────────── */}
      <div className="space-y-3">
        <Link
          href="/orders"
          className="block p-4 border border-neutral-800 rounded-lg hover:border-amber-400/50 hover:bg-neutral-900/40 transition-colors min-h-[44px]"
        >
          <p className="text-neutral-100 font-medium">Order History</p>
          <p className="text-sm text-neutral-400">
            View all your past orders
          </p>
        </Link>

        <Link
          href="/menu"
          className="block p-4 border border-neutral-800 rounded-lg hover:border-amber-400/50 hover:bg-neutral-900/40 transition-colors min-h-[44px]"
        >
          <p className="text-neutral-100 font-medium">Browse Menu</p>
          <p className="text-sm text-neutral-400">
            Find something new to try
          </p>
        </Link>

        {user.role === "staff" && (
          <Link
            href="/kitchen"
            className="block p-4 border border-amber-400/40 rounded-lg hover:bg-amber-400/5 transition-colors min-h-[44px]"
          >
            <p className="text-amber-400 font-medium">Kitchen Dashboard</p>
            <p className="text-sm text-neutral-400">
              Manage live orders (staff only)
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="border border-neutral-800 rounded-lg p-4 bg-neutral-900/30">
      <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">
        {label}
      </p>
      <p className="text-2xl font-serif text-amber-400">{value}</p>
    </div>
  );
}