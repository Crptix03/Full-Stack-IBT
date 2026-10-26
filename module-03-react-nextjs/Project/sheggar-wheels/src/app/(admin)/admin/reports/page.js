import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { etb } from "@/lib/format";
import ExportCsvButton from "@/components/ExportCsvButton";

export const metadata = { title: "Admin — Reports" };

export default async function AdminReportsPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/");

  const bookings = db.bookings;
  const completed = bookings.filter((b) => ["completed", "reviewed"].includes(b.status));
  const revenue = completed.reduce((s, b) => s + b.fee, 0);
  const volume = completed.reduce((s, b) => s + b.total, 0);

  const byMonth = {};
  for (const b of completed) {
    const m = b.startDate.slice(0, 7);
    if (!byMonth[m]) byMonth[m] = { bookings: 0, revenue: 0, volume: 0 };
    byMonth[m].bookings += 1;
    byMonth[m].revenue += b.fee;
    byMonth[m].volume  += b.total;
  }
  const monthly = Object.entries(byMonth).sort().reverse();

  // CSV for monthly summary
  const monthlyCsv = monthly.map(([month, d]) => ({
    Month:                month,
    "Completed Bookings": d.bookings,
    "Platform Fees (ETB)": d.revenue,
    "Gross Volume (ETB)":  d.volume,
  }));

  // CSV for full platform bookings
  const allBookingsCsv = bookings.map((b) => {
    const car    = db.cars.find((c) => c.id === b.carId);
    const renter = db.users.find((u) => u.id === b.renterId);
    const owner  = db.users.find((u) => u.id === b.ownerId);
    return {
      "Booking ID":    b.id,
      Car:             car ? `${car.make} ${car.model}` : b.carId,
      Renter:          renter?.name || b.renterId,
      Owner:           owner?.name || b.ownerId,
      "Start Date":    b.startDate,
      "End Date":      b.endDate,
      Days:            b.days,
      Subtotal:        b.subtotal,
      "Platform Fee":  b.fee,
      Total:           b.total,
      Status:          b.status,
    };
  });

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1">Reports</h1>
          <p className="text-neutral-500 text-sm">Platform-wide summary.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {monthly.length > 0 && (
            <ExportCsvButton
              data={monthlyCsv}
              filename={`sheggar-monthly-report-${today}.csv`}
              label="Export Monthly"
            />
          )}
          {bookings.length > 0 && (
            <ExportCsvButton
              data={allBookingsCsv}
              filename={`sheggar-all-bookings-${today}.csv`}
              label="Export All Bookings"
            />
          )}
        </div>
      </div>

      {/* ── Stat cards ─────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Card label="Total bookings"  value={bookings.length} />
        <Card label="Completed"       value={completed.length} />
        <Card label="Platform fees"   value={etb.format(revenue)} highlight />
        <Card label="Total volume"    value={etb.format(volume)} />
        <Card label="Total users"     value={db.users.length} />
        <Card label="Listed cars"     value={db.cars.filter((c) => c.status === "approved").length} />
      </div>

      {/* ── Monthly table ───────────────────────────────── */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100">
          <h2 className="font-bold text-neutral-900">Monthly Platform Fees</h2>
        </div>
        {monthly.length === 0 ? (
          <div className="px-6 py-10 text-center text-neutral-500 text-sm">
            No completed bookings yet.
          </div>
        ) : (
          <ul>
            {monthly.map(([month, data]) => {
              const [year, mon] = month.split("-");
              const label = new Date(`${year}-${mon}-01`).toLocaleDateString("en-US", {
                month: "long", year: "numeric",
              });
              return (
                <li key={month} className="px-6 py-4 border-b border-neutral-100 last:border-0">
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{label}</p>
                      <p className="text-xs text-neutral-500">
                        {data.bookings} booking{data.bookings === 1 ? "" : "s"} · {etb.format(data.volume)} volume
                      </p>
                    </div>
                    <span className="text-sm font-bold text-indigo-600">
                      {etb.format(data.revenue)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function Card({ label, value, highlight = false }) {
  return (
    <div className={`p-5 rounded-2xl border ${highlight ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-neutral-200"}`}>
      <p className={`text-xs uppercase tracking-wider mb-1 ${highlight ? "text-indigo-200" : "text-neutral-500"}`}>
        {label}
      </p>
      <p className={`text-2xl font-black ${highlight ? "text-white" : "text-neutral-900"}`}>
        {value}
      </p>
    </div>
  );
}
