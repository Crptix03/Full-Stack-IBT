import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format-date";

export const metadata = { title: "My Disputes" };

export default async function OwnerDisputesPage() {
  const session = await getSession();
  if (!session) redirect("/signin?next=/owner");

  if (!db.disputes) db.disputes = [];

  const myDisputes = db.disputes.filter((d) => {
    const booking = db.bookings.find((b) => b.id === d.bookingId);
    return booking?.ownerId === session.userId;
  });

  const carById = (id) => db.cars.find((c) => c.id === id);
  const bookingById = (id) => db.bookings.find((b) => b.id === id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black mb-1">Disputes</h1>
      <p className="text-neutral-500 text-sm mb-8">{myDisputes.length} dispute{myDisputes.length === 1 ? "" : "s"} on your bookings.</p>

      {myDisputes.length === 0 ? (
        <div className="p-12 bg-white border border-neutral-200 rounded-2xl text-center text-neutral-500">
          No disputes filed against your cars.
        </div>
      ) : (
        <ul className="space-y-4">
          {myDisputes.map((dispute) => {
            const booking = bookingById(dispute.bookingId);
            const car = booking ? carById(booking.carId) : null;
            return (
              <li key={dispute.id} className="p-6 bg-white border border-neutral-200 rounded-2xl">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <p className="font-semibold">{car ? `${car.make} ${car.model}` : "Unknown car"}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    dispute.status === "open" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-800"
                  }`}>{dispute.status}</span>
                </div>
                <p className="text-xs text-neutral-500 mb-2">Filed {formatDate(dispute.createdAt.slice(0, 10))} · Reason: {dispute.reason}</p>
                {dispute.description && <p className="text-sm text-neutral-700">{dispute.description}</p>}
                {dispute.status === "resolved" && dispute.resolutionNotes && (
                  <p className="mt-3 text-xs text-neutral-500 italic">Resolved: {dispute.resolutionNotes}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
