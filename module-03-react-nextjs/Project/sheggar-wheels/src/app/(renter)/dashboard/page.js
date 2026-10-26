import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/session";
import { findUserById } from "@/lib/users";
import { db } from "@/lib/db";
import { etb } from "@/lib/format";
import { formatDate } from "@/lib/format-date";
import BookingStatusPill from "@/components/BookingStatusPill";
import { redirect } from "next/navigation";
import { Calendar, CheckCircle, XCircle, Wallet, ArrowRight, Car } from "lucide-react";

export const metadata = { title: "My Dashboard" };

export default async function RenterDashboard() {
  const session = await getSession();
  if (!session) redirect("/signin?next=/dashboard");

  const user = findUserById(session.userId);
  const allBookings = db.bookings
    .filter((b) => b.renterId === session.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const carById = (id) => db.cars.find((c) => c.id === id);

  const upcoming = allBookings.filter((b) =>
    ["requested", "confirmed", "in_progress"].includes(b.status)
  );
  const completed = allBookings.filter((b) =>
    ["completed", "reviewed"].includes(b.status)
  );
  const cancelled = allBookings.filter((b) =>
    ["cancelled", "declined"].includes(b.status)
  );
  const totalSpent = allBookings
    .filter((b) => b.paymentStatus === "paid" && !["cancelled", "declined"].includes(b.status))
    .reduce((sum, b) => sum + b.total, 0);

  const nextTrip = upcoming
    .filter((b) => ["confirmed", "in_progress"].includes(b.status))
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-1">My Dashboard</h1>
        <p className="text-neutral-500 text-sm">
          Welcome back, {user?.name || "Renter"}.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat icon={<Calendar className="w-5 h-5" />} label="Upcoming" value={upcoming.length} color="indigo" />
        <Stat icon={<CheckCircle className="w-5 h-5" />} label="Completed" value={completed.length} color="green" />
        <Stat icon={<XCircle className="w-5 h-5" />} label="Cancelled" value={cancelled.length} color="neutral" />
        <Stat icon={<Wallet className="w-5 h-5" />} label="Total spent" value={etb.format(totalSpent)} color="orange" />
      </div>

      {/* Next trip */}
      {nextTrip && carById(nextTrip.carId) && (
        <div className="mb-8 p-6 bg-indigo-600 text-white rounded-2xl">
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="text-indigo-200 text-xs uppercase tracking-wider mb-1">Next trip</p>
              <h2 className="text-2xl font-black mb-1">
                {carById(nextTrip.carId).make} {carById(nextTrip.carId).model}
              </h2>
              <p className="text-indigo-100 text-sm">
                {formatDate(nextTrip.startDate)} – {formatDate(nextTrip.endDate)}
              </p>
            </div>
            <Link
              href={`/bookings/${nextTrip.id}`}
              className="shrink-0 px-4 py-2 bg-white text-indigo-600 font-semibold rounded-xl text-sm hover:bg-indigo-50 transition-colors flex items-center gap-1"
            >
              View <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Recent bookings */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-neutral-200 flex justify-between items-center">
          <h2 className="font-bold text-lg">Recent Bookings</h2>
          <Link href="/bookings" className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold">
            View all →
          </Link>
        </div>
        {allBookings.length === 0 ? (
          <div className="p-12 text-center">
            <Car className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-600 mb-4">You haven&apos;t booked a car yet.</p>
            <Link href="/cars" className="inline-block px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
              Browse Cars
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {allBookings.slice(0, 5).map((booking) => {
              const car = carById(booking.carId);
              if (!car) return null;
              return (
                <li key={booking.id}>
                  <Link
                    href={`/bookings/${booking.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                      <Image
                        src={car.photos[0]}
                        alt={`${car.make} ${car.model}`}
                        fill
                        sizes="64px"
                        className="object-cover"
                        style={{ objectPosition: car.photoPosition || "center" }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900 truncate">{car.make} {car.model}</p>
                      <p className="text-xs text-neutral-500">
                        {formatDate(booking.startDate)} – {formatDate(booking.endDate)}
                      </p>
                    </div>
                    <BookingStatusPill status={booking.status} />
                    <ArrowRight className="w-4 h-4 text-neutral-400 shrink-0" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value, color }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    neutral: "bg-neutral-100 text-neutral-600",
  };
  return (
    <div className="p-5 bg-white border border-neutral-200 rounded-2xl">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">{label}</p>
      <p className="text-2xl font-black text-neutral-900">{value}</p>
    </div>
  );
}
