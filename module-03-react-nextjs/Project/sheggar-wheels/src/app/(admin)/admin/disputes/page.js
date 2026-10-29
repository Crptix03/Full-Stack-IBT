import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format-date";
import AdminDisputeActions from "@/components/AdminDisputeActions";

export const metadata = { title: "Admin — Disputes" };

export default async function AdminDisputesPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/unauthorized");

  if (!db.disputes) db.disputes = [];
  const disputes = [...db.disputes].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const carById = (id) => db.cars.find((c) => c.id === id);
  const bookingById = (id) => db.bookings.find((b) => b.id === id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black mb-1">Disputes</h1>
      <p className="text-neutral-500 text-sm mb-8">
        {disputes.filter((d) => d.status === "open").length} open · {disputes.filter((d) => d.status === "resolved").length} resolved
      </p>

      {disputes.length === 0 ? (
        <div className="p-12 bg-white border border-neutral-200 rounded-2xl text-center text-neutral-500">
          No disputes filed.
        </div>
      ) : (
        <ul className="space-y-4">
          {disputes.map((dispute) => {
            const booking = bookingById(dispute.bookingId);
            const car = booking ? carById(booking.carId) : null;
            return (
              <li key={dispute.id} className="p-6 bg-white border border-neutral-200 rounded-2xl">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-semibold text-neutral-900">{car ? `${car.make} ${car.model}` : "Unknown car"}</p>
                    <p className="text-xs text-neutral-500">Filed {formatDate(dispute.createdAt.slice(0, 10))} · Reason: {dispute.reason}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    dispute.status === "open" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-800"
                  }`}>{dispute.status}</span>
                </div>
                {dispute.description && <p className="text-sm text-neutral-700 mb-4">{dispute.description}</p>}
                {dispute.status === "open" ? (
                  <AdminDisputeActions disputeId={dispute.id} />
                ) : (
                  <p className="text-xs text-neutral-500 italic">Resolved: {dispute.resolutionNotes}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
