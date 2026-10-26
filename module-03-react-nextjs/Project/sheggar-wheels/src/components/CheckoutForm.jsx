"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { placeBooking } from "@/app/actions";
import { etb } from "@/lib/format";
import { formatDate, nightsBetween, todayISO } from "@/lib/format-date";
import { Calendar, Phone, CreditCard, Loader2 } from "lucide-react";

const FEE_RATE = 0.05;

function isOverlapping(start, end, ranges) {
  for (const r of ranges) {
    if (start < r.end && r.start < end) return true;
  }
  return false;
}

export default function CheckoutForm({ car, bookedRanges }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const days = startDate && endDate ? nightsBetween(startDate, endDate) : 0;
  const subtotal = car.pricePerDay * days;
  const fee = Math.round(subtotal * FEE_RATE);
  const total = subtotal + fee;

  const datesValid = startDate && endDate && startDate < endDate;
  const available = datesValid ? !isOverlapping(startDate, endDate, bookedRanges) : null;
  const canPay = datesValid && available === true && !isPending;

  const handlePayment = () => {
    setError("");
    const formData = new FormData();
    formData.set("carId", car.id);
    formData.set("startDate", startDate);
    formData.set("endDate", endDate);

    startTransition(async () => {
      const result = await placeBooking(null, formData);
      if (result?.error) setError(result.error);
      // On success placeBooking calls redirect() server-side — router will update.
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black mb-2">Checkout</h1>
      <p className="text-neutral-500 mb-8">This is a demo — no real payment is processed.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Dates */}
          <div className="p-6 bg-white border border-neutral-200 rounded-2xl">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" /> Rental dates
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Start date</label>
                <input
                  type="date"
                  min={todayISO()}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">End date</label>
                <input
                  type="date"
                  min={startDate || todayISO()}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            {datesValid && (
              <p className="text-xs text-neutral-500 mt-3">
                {days} day{days > 1 ? "s" : ""} · {formatDate(startDate)} – {formatDate(endDate)}
              </p>
            )}
            {available === false && (
              <p className="text-xs text-red-600 mt-3">Car is not available for those dates.</p>
            )}
            {available === true && (
              <p className="text-xs text-green-600 mt-3">Car is available for those dates.</p>
            )}
          </div>

          {/* Mock payment */}
          <div className="p-6 bg-white border border-neutral-200 rounded-2xl">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-600" /> Mock TeleBirr Payment
            </h2>
            <p className="text-sm text-neutral-600 mb-4">
              No real money will be charged. A demo transaction is simulated.
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-500 bg-neutral-50 px-4 py-3 rounded-xl">
              <Phone className="w-4 h-4" /> TeleBirr · +251 911 000 000 (demo)
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>

        {/* Summary */}
        <aside>
          <div className="sticky top-20 p-6 bg-white border border-neutral-200 rounded-2xl">
            <div className="relative w-full h-36 rounded-xl overflow-hidden bg-neutral-100 mb-4">
              <Image
                src={car.photos[0]}
                alt={`${car.make} ${car.model}`}
                fill
                sizes="300px"
                className="object-cover"
                style={{ objectPosition: car.photoPosition || "center" }}
              />
            </div>
            <h2 className="font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm mb-4 pb-4 border-b border-neutral-200">
              <p className="font-semibold text-neutral-900">{car.make} {car.model}</p>
              <p className="text-xs text-neutral-500">{etb.format(car.pricePerDay)} × {days || "—"} day{days === 1 ? "" : "s"}</p>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span><span>{etb.format(subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Platform fee (5%)</span><span>{etb.format(fee)}</span>
              </div>
              <div className="flex justify-between font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Total</span><span>{etb.format(total)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handlePayment}
              disabled={!canPay}
              className="w-full mt-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
              ) : (
                "Complete Demo Payment"
              )}
            </button>
            <p className="text-xs text-neutral-400 text-center mt-3">⚠️ Demo only — no real charge.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
