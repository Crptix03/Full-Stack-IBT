import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { findUserById } from "@/lib/users";
import { db } from "@/lib/db";
import { etb } from "@/lib/format";
import { formatDate } from "@/lib/format-date";
import BookingStatusPill from "@/components/BookingStatusPill";
import { Car as CarIcon, Calendar, Wallet, TrendingUp, ArrowRight, Plus } from "lucide-react";

export const metadata = { title: "Owner Dashboard" };

export default async function OwnerDashboard() {
  const session = await getSession();
  if (!session) redirect("/signin?next=/owner");

  const user = findUserById(session.userId);
  if (!user?.roles?.includes("owner")) redirect("/");

  const myCars = db.cars.filter((c) => c.ownerId === session.userId);
  const myBookings = db.bookings
    .filter((b) => b.ownerId === session.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const carById = (id) => myCars.find((c) => c.id === id);

  const approved = myCars.filter((c) => c.status === "approved");
  const pending = myBookings.filter((b) => b.status === "requested");
  const confirmed = myBookings.filter((b) => ["confirmed", "in_progress"].includes(b.status));
  const earnings = myBookings
    .filter((b) => ["completed", "reviewed"].includes(b.status))
    .reduce((sum, b) => sum + b.subtotal, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1">Owner Dashboard</h1>
          <p className="text-neutral-500 text-sm">Welcome, {user.name}.</p>
        </div>
        <Link href="/owner/cars/new" className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Car
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat icon={<CarIcon className="w-5 h-5" />} label="Approved cars" value={approved.length} color="indigo" />
        <Stat icon={<Calendar className="w-5 h-5" />} label="Pending requests" value={pending.length} color="orange" />
        <Stat icon={<TrendingUp className="w-5 h-5" />} label="Active rentals" value={confirmed.length} color="purple" />
        <Stat icon={<Wallet className="w-5 h-5" />} label="Total earnings" value={etb.format(earnings)} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending requests */}
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-neutral-200 flex justify-between items-center">
            <h2 className="font-bold">Pending Requests</h2>
            <Link href="/owner/bookings" className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold">View all →</Link>
          </div>
          {pending.length === 0 ? (
            <div className="p-8 text-center text-sm text-neutral-500">No pending requests.</div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {pending.slice(0, 4).map((booking) => {
                const car = carById(booking.carId);
                if (!car) return null;
                return (
                  <li key={booking.id}>
                    <Link href="/owner/bookings" className="flex items-center gap-3 p-4 hover:bg-neutral-50 transition-colors">
                      <div className="relative w-14 h-10 rounded overflow-hidden bg-neutral-100 shrink-0">
                        <Image src={car.photos[0]} alt={`${car.make} ${car.model}`} fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{car.make} {car.model}</p>
                        <p className="text-xs text-neutral-500">{formatDate(booking.startDate)}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* My cars */}
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-neutral-200 flex justify-between items-center">
            <h2 className="font-bold">My Cars</h2>
            <Link href="/owner/cars" className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold">View all →</Link>
          </div>
          {myCars.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-neutral-500 mb-3">You haven&apos;t listed any cars yet.</p>
              <Link href="/owner/cars/new" className="inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl">Add your first car</Link>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {myCars.slice(0, 4).map((car) => (
                <li key={car.id}>
                  <Link href={`/owner/cars/${car.id}/edit`} className="flex items-center gap-3 p-4 hover:bg-neutral-50 transition-colors">
                    <div className="relative w-14 h-10 rounded overflow-hidden bg-neutral-100 shrink-0">
                      <Image src={car.photos[0]} alt={`${car.make} ${car.model}`} fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{car.make} {car.model}</p>
                      <p className="text-xs text-neutral-500">{etb.format(car.pricePerDay)}/day</p>
                    </div>
                    <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-semibold ${
                      car.status === "approved" ? "bg-green-100 text-green-800"
                      : car.status === "pending" ? "bg-amber-100 text-amber-800"
                      : "bg-neutral-100 text-neutral-600"
                    }`}>{car.status}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
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
