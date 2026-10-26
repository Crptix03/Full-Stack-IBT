import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { getEarningsBreakdown } from "@/lib/earnings";
import { etb } from "@/lib/format";
import { Wallet, TrendingUp, Calendar, Car } from "lucide-react";
import ExportCsvButton from "@/components/ExportCsvButton";

export const metadata = { title: "Earnings" };

export default async function EarningsPage() {
  const session = await getSession();
  if (!session) redirect("/signin?next=/owner/earnings");

  const data = getEarningsBreakdown(db.cars, db.bookings, session.userId);

  // Total days rented across all completed bookings
  const totalDays = data.byCar.reduce((sum, c) => sum + c.days, 0);

  // CSV data — one row per completed booking
  const completedBookings = db.bookings.filter(
    (b) => b.ownerId === session.userId && ["completed", "reviewed"].includes(b.status)
  );
  const csvRows = completedBookings.map((b) => {
    const car = db.cars.find((c) => c.id === b.carId);
    const renter = db.users.find((u) => u.id === b.renterId);
    return {
      "Booking ID":    b.id,
      Car:             car ? `${car.make} ${car.model}` : b.carId,
      Renter:          renter?.name || b.renterId,
      "Start Date":    b.startDate,
      "End Date":      b.endDate,
      Days:            b.days,
      "Price/Day":     b.pricePerDay,
      Subtotal:        b.subtotal,
      "Platform Fee":  b.fee,
      Total:           b.total,
      Status:          b.status,
    };
  });
  const csvFilename = `sheggar-earnings-${new Date().toISOString().slice(0, 10)}.csv`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1">Earnings</h1>
          <p className="text-neutral-500 text-sm">
            Your revenue from completed rentals.
          </p>
        </div>
        {csvRows.length > 0 && (
          <ExportCsvButton
            data={csvRows}
            filename={csvFilename}
            label="Export CSV"
          />
        )}
      </div>

      {/* ── Summary stat cards ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-indigo-600 text-white rounded-2xl p-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500 mb-3">
            <Wallet className="w-5 h-5" />
          </div>
          <p className="text-xs uppercase tracking-wider text-indigo-200 mb-1">Total Revenue</p>
          <p className="text-3xl font-black">{etb.format(data.total)}</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-green-50 text-green-600 mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Completed Bookings</p>
          <p className="text-3xl font-black text-neutral-900">{data.bookingCount}</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50 text-orange-500 mb-3">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Total Days Rented</p>
          <p className="text-3xl font-black text-neutral-900">{totalDays}</p>
        </div>
      </div>

      {/* ── Monthly breakdown ──────────────────────────── */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <h2 className="font-bold text-neutral-900">Monthly Revenue</h2>
        </div>

        {data.monthly.length === 0 ? (
          <div className="px-6 py-10 text-center text-neutral-500 text-sm">
            No completed bookings yet.
          </div>
        ) : (
          <ul>
            {data.monthly.map(({ month, revenue }) => {
              // Format "2026-10" → "October 2026"
              const [year, mon] = month.split("-");
              const label = new Date(`${year}-${mon}-01`).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              });
              // Width of the bar as a percentage of the max
              const max = Math.max(...data.monthly.map((m) => m.revenue));
              const pct = max > 0 ? Math.round((revenue / max) * 100) : 0;

              return (
                <li key={month} className="px-6 py-4 border-b border-neutral-100 last:border-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-neutral-700">{label}</span>
                    <span className="text-sm font-bold text-indigo-600">{etb.format(revenue)}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ── Revenue by car ─────────────────────────────── */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
          <Car className="w-4 h-4 text-indigo-600" />
          <h2 className="font-bold text-neutral-900">Revenue by Car</h2>
        </div>

        {data.byCar.filter((c) => c.revenue > 0).length === 0 ? (
          <div className="px-6 py-10 text-center text-neutral-500 text-sm">
            No earnings recorded yet.
          </div>
        ) : (
          <ul>
            {data.byCar
              .filter((c) => c.revenue > 0)
              .sort((a, b) => b.revenue - a.revenue)
              .map((car, idx) => {
                const maxCar = Math.max(...data.byCar.map((c) => c.revenue));
                const pct = maxCar > 0 ? Math.round((car.revenue / maxCar) * 100) : 0;
                return (
                  <li key={car.id} className="px-6 py-4 border-b border-neutral-100 last:border-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          {idx === 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                              Top earner
                            </span>
                          )}
                          <p className="text-sm font-semibold text-neutral-900">{car.name}</p>
                        </div>
                        <p className="text-xs text-neutral-500">
                          {car.bookings} booking{car.bookings === 1 ? "" : "s"} · {car.days} day{car.days === 1 ? "" : "s"} rented
                        </p>
                      </div>
                      <span className="text-sm font-bold text-indigo-600 shrink-0">
                        {etb.format(car.revenue)}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-400 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
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
