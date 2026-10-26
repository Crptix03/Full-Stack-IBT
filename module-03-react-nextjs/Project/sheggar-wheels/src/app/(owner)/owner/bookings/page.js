import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { etb } from "@/lib/format";
import { formatDate } from "@/lib/format-date";
import BookingStatusPill from "@/components/BookingStatusPill";
import OwnerBookingActions from "@/components/OwnerBookingActions";
import DisputeForm from "@/components/DisputeForm";
import { ArrowRight } from "lucide-react";

export const metadata = { title: "Booking Requests" };

export default async function OwnerBookingsPage() {
  const session = await getSession();
  if (!session) redirect("/signin?next=/owner/bookings");

  const myBookings = db.bookings
    .filter((b) => b.ownerId === session.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const carById = (id) => db.cars.find((c) => c.id === id);
  const userById = (id) => db.users.find((u) => u.id === id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black mb-1">Booking Requests</h1>
      <p className="text-neutral-500 text-sm mb-8">{myBookings.length} total bookings on your cars.</p>

      {myBookings.length === 0 ? (
        <div className="p-12 bg-white border border-neutral-200 rounded-2xl text-center text-neutral-500">
          No bookings yet.
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
          <ul className="divide-y divide-neutral-100">
            {myBookings.map((booking) => {
              const car = carById(booking.carId);
              const renter = userById(booking.renterId);
              if (!car) return null;
              return (
                <li key={booking.id} className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                      <Image src={car.photos[0]} alt={`${car.make} ${car.model}`} fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-neutral-900">{car.make} {car.model}</p>
                        <BookingStatusPill status={booking.status} />
                      </div>
                      <p className="text-sm text-neutral-500">
                        {formatDate(booking.startDate)} – {formatDate(booking.endDate)} · {booking.days} day{booking.days > 1 ? "s" : ""}
                      </p>
                      <p className="text-sm text-neutral-500">Renter: {renter?.name || "—"}</p>
                      <p className="text-sm font-semibold text-indigo-600 mt-1">{etb.format(booking.total)}</p>
                    </div>
                  </div>
                  <div className="mt-3 pl-24">
                    <OwnerBookingActions booking={booking} />
                    {["confirmed", "in_progress"].includes(booking.status) && (
                      <div className="mt-3">
                        <DisputeForm bookingId={booking.id} />
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
