import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { etb } from "@/lib/format";
import { formatDate } from "@/lib/format-date";
import BookingStatusPill from "@/components/BookingStatusPill";
import ExportCsvButton from "@/components/ExportCsvButton";
import { ArrowRight, Car } from "lucide-react";

export const metadata = { title: "My Bookings" };

const FILTERS = [
  { key: "all", label: "All" },
  { key: "requested", label: "Requested" },
  { key: "confirmed", label: "Confirmed" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export default async function BookingsPage({ searchParams }) {
  const session = await getSession();
  if (!session) redirect("/signin?next=/bookings");

  const params = await searchParams;
  const filter = params.filter || "all";

  const allBookings = db.bookings
    .filter((b) => b.renterId === session.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const carById = (id) => db.cars.find((c) => c.id === id);

  const filtered =
    filter === "all"
      ? allBookings
      : allBookings.filter((b) => {
          if (filter === "completed") return ["completed", "reviewed"].includes(b.status);
          if (filter === "cancelled") return ["cancelled", "declined"].includes(b.status);
          return b.status === filter;
        });

  // CSV rows for export — based on current filter view
  const csvRows = filtered.map((b) => {
    const car = carById(b.carId);
    return {
      "Booking ID":    b.id,
      Car:             car ? `${car.make} ${car.model}` : b.carId,
      "Start Date":    b.startDate,
      "End Date":      b.endDate,
      Days:            b.days,
      Status:          b.status,
      "Payment":       b.paymentStatus,
      "Total (ETB)":   b.total,
    };
  });
  const csvFilename = `sheggar-bookings-${new Date().toISOString().slice(0, 10)}.csv`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1">My Bookings</h1>
          <p className="text-neutral-500 text-sm">
            {allBookings.length} booking{allBookings.length === 1 ? "" : "s"} total
          </p>
        </div>
        {allBookings.length > 0 && (
          <ExportCsvButton data={csvRows} filename={csvFilename} label="Export CSV" />
        )}
      </div>

      {/* Filter tabs — plain links, no JS needed */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={`/bookings${f.key !== "all" ? `?filter=${f.key}` : ""}`}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              filter === f.key
                ? "bg-indigo-600 text-white"
                : "bg-white border border-neutral-200 text-neutral-600 hover:border-indigo-400 hover:text-indigo-600"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 bg-white border border-neutral-200 rounded-2xl text-center">
          <Car className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-600 mb-4">
            {filter === "all" ? "You haven't booked a car yet." : "No bookings with this status."}
          </p>
          {filter === "all" && (
            <Link href="/cars" className="inline-block px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
              Browse Cars
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
          <ul className="divide-y divide-neutral-100">
            {filtered.map((booking) => {
              const car = carById(booking.carId);
              if (!car) return null;
              return (
                <li key={booking.id}>
                  <Link href={`/bookings/${booking.id}`} className="flex items-center gap-4 p-5 hover:bg-neutral-50 transition-colors">
                    <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                      <Image
                        src={car.photos[0]}
                        alt={`${car.make} ${car.model}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                        style={{ objectPosition: car.photoPosition || "center" }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900">{car.make} {car.model}</p>
                      <p className="text-sm text-neutral-500">
                        {formatDate(booking.startDate)} – {formatDate(booking.endDate)} · {booking.days} day{booking.days > 1 ? "s" : ""}
                      </p>
                      <p className="text-sm font-semibold text-indigo-600 mt-1">{etb.format(booking.total)}</p>
                    </div>
                    <BookingStatusPill status={booking.status} />
                    <ArrowRight className="w-4 h-4 text-neutral-400 shrink-0" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
