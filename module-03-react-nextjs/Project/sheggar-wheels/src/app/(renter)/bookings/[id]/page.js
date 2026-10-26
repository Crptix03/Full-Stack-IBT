import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { etb } from "@/lib/format";
import { formatDate } from "@/lib/format-date";
import BookingStatusPill from "@/components/BookingStatusPill";
import BookingActions from "@/components/BookingActions";
import DisputeForm from "@/components/DisputeForm";
import { ArrowLeft, Calendar, MapPin, User, Phone } from "lucide-react";

export async function generateMetadata({ params }) {
  return { title: "Booking Details" };
}

export default async function BookingDetailPage({ params }) {
  const session = await getSession();
  if (!session) redirect("/signin?next=/bookings");

  const { id } = await params;

  const booking = db.bookings.find((b) => b.id === id);
  if (!booking || booking.renterId !== session.userId) notFound();

  const car = db.cars.find((c) => c.id === booking.carId) || null;
  const owner = car ? db.users.find((u) => u.id === car.ownerId) : null;
  const existingReview = db.reviews.find((r) => r.bookingId === id) || null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/bookings" className="text-indigo-600 text-sm hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          My Bookings
        </Link>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-neutral-900 mb-1">Booking Details</h1>
            <p className="text-xs text-neutral-500">ID: {booking.id}</p>
          </div>
          <BookingStatusPill status={booking.status} />
        </div>

        {car && (
          <div className="flex gap-4 p-4 bg-neutral-50 rounded-xl mb-6">
            <div className="relative w-24 h-20 rounded-lg overflow-hidden bg-neutral-200 shrink-0">
              <Image
                src={car.photos[0]}
                alt={`${car.make} ${car.model}`}
                fill
                sizes="96px"
                className="object-cover"
                style={{ objectPosition: car.photoPosition || "center" }}
              />
            </div>
            <div>
              <p className="font-bold">{car.make} {car.model}</p>
              <p className="text-xs text-neutral-500">{car.year} · {car.neighbourhood}</p>
              <p className="text-sm font-semibold text-indigo-600 mt-1">{etb.format(booking.total)}</p>
            </div>
          </div>
        )}

        <div className="space-y-3 text-sm mb-6">
          <Row icon={<Calendar className="w-4 h-4 text-indigo-600" />} label="Dates">
            {formatDate(booking.startDate)} – {formatDate(booking.endDate)} ({booking.days} day{booking.days > 1 ? "s" : ""})
          </Row>
          <Row icon={<User className="w-4 h-4 text-indigo-600" />} label="Owner">
            {owner?.name || "—"}
          </Row>
          {owner?.phone && (
            <Row icon={<Phone className="w-4 h-4 text-indigo-600" />} label="Contact">
              {owner.phone}
            </Row>
          )}
          {car && (
            <Row icon={<MapPin className="w-4 h-4 text-indigo-600" />} label="Location">
              {car.neighbourhood}, {car.city}
            </Row>
          )}
        </div>

        <div className="pt-4 border-t border-neutral-200 space-y-1 text-sm mb-6">
          <div className="flex justify-between text-neutral-600">
            <span>{etb.format(booking.pricePerDay)} × {booking.days} day{booking.days > 1 ? "s" : ""}</span>
            <span>{etb.format(booking.subtotal)}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Platform fee (5%)</span>
            <span>{etb.format(booking.fee)}</span>
          </div>
          <div className="flex justify-between font-bold text-neutral-900 pt-2 border-t border-neutral-200">
            <span>Total</span>
            <span>{etb.format(booking.total)}</span>
          </div>
        </div>

        {/* Client component handles cancel + review actions */}
        <BookingActions
          booking={booking}
          existingReview={existingReview}
        />

        {/* Dispute form — only for confirmed or in_progress bookings that
            haven't already been disputed */}
        {["confirmed", "in_progress"].includes(booking.status) && (
          <DisputeForm bookingId={booking.id} />
        )}
      </div>
    </div>
  );
}

function Row({ icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-neutral-900">{children}</p>
      </div>
    </div>
  );
}
