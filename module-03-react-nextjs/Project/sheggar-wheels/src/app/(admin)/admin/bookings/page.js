import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { etb } from "@/lib/format";
import { formatDate } from "@/lib/format-date";
import BookingStatusPill from "@/components/BookingStatusPill";
import ExportCsvButton from "@/components/ExportCsvButton";

export const metadata = { title: "Admin — All Bookings" };

export default async function AdminBookingsPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/unauthorized");

  const bookings = [...db.bookings].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const carById = (id) => db.cars.find((c) => c.id === id);
  const userById = (id) => db.users.find((u) => u.id === id);

  const csvRows = bookings.map((b) => {
    const car = carById(b.carId);
    const renter = userById(b.renterId);
    const owner = userById(b.ownerId);
    return {
      "Booking ID":   b.id,
      Car:            car ? `${car.make} ${car.model}` : b.carId,
      Renter:         renter?.name || b.renterId,
      Owner:          owner?.name || b.ownerId,
      "Start Date":   b.startDate,
      "End Date":     b.endDate,
      Days:           b.days,
      Subtotal:       b.subtotal,
      "Platform Fee": b.fee,
      Total:          b.total,
      Status:         b.status,
      Payment:        b.paymentStatus,
    };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1">All Bookings</h1>
          <p className="text-neutral-500 text-sm">{bookings.length} total bookings.</p>
        </div>
        {bookings.length > 0 && (
          <ExportCsvButton
            data={csvRows}
            filename={`sheggar-all-bookings-${new Date().toISOString().slice(0, 10)}.csv`}
            label="Export CSV"
          />
        )}
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <ul className="divide-y divide-neutral-100">
          {bookings.map((booking) => {
            const car = carById(booking.carId);
            const renter = userById(booking.renterId);
            return (
              <li key={booking.id} className="p-5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-neutral-900">{car ? `${car.make} ${car.model}` : booking.carId}</p>
                    <BookingStatusPill status={booking.status} />
                  </div>
                  <p className="text-sm text-neutral-500">
                    {formatDate(booking.startDate)} – {formatDate(booking.endDate)} · {booking.days} day{booking.days > 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-neutral-500">Renter: {renter?.name || "—"} · {etb.format(booking.total)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
