import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { etb } from "@/lib/format";
import { formatDate } from "@/lib/format-date";
import { findCarBySlug, toCarSlug } from "@/lib/slug";
import CarCard from "@/components/CarCard";
import {
  Settings, Users, Fuel, MapPin, Snowflake, Calendar, Star, ArrowLeft
} from "lucide-react";

export async function generateStaticParams() {
  // Import directly from seed — SEED_CARS is a plain array available
  // at build time, unlike db which requires the globalThis runtime.
  // This tells Next.js all valid car slugs so it statically pre-renders
  // each car page. The share image is served by the route handler at
  // /cars/[slug]/opengraph-image (see opengraph-image/route.jsx).
  const { SEED_CARS } = await import("@/lib/seed");
  return SEED_CARS
    .filter((c) => c.status === "approved")
    .map((car) => ({ slug: toCarSlug(car.make, car.model, car.year) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const car = findCarBySlug(db.cars.filter((c) => c.status === "approved"), slug);
  if (!car) return { title: "Car not found" };

  const title = `${car.make} ${car.model} (${car.year})`;
  const description = `Rent a ${car.make} ${car.model} in ${car.neighbourhood}, Addis Ababa for ${etb.format(car.pricePerDay)} per day. ${car.description}`;
  const ogImage = {
    url: `/cars/${slug}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: `${car.make} ${car.model}`,
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}

export default async function CarDetailPage({ params }) {
  const { slug } = await params;

  const car = findCarBySlug(db.cars, slug);
  if (!car || car.status !== "approved") notFound();

  const owner = db.users.find((u) => u.id === car.ownerId);
  const reviews = db.reviews.filter((r) => r.carId === car.id);

  const bookedRanges = db.bookings
    .filter((b) => b.carId === car.id && ["confirmed", "in_progress"].includes(b.status))
    .map((b) => ({ start: b.startDate, end: b.endDate }));

  const similar = db.cars
    .filter((c) => c.id !== car.id && c.status === "approved" && c.neighbourhood === car.neighbourhood)
    .slice(0, 3);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const carSlug = toCarSlug(car.make, car.model, car.year);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/cars" className="text-indigo-600 text-sm hover:underline font-medium inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Browse
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative w-full h-96 rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 mb-6">
            <Image
              src={car.photos[0]}
              alt={`${car.make} ${car.model}`}
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover"
              style={{ objectPosition: car.photoPosition || "center" }}
              priority
            />
          </div>

          <h1 className="text-4xl font-black text-neutral-900 mb-2">
            {car.make} {car.model}
          </h1>
          <p className="text-neutral-500 mb-6">
            {car.year} · {car.transmission} · {car.seats} seats
          </p>
          <p className="text-neutral-700 leading-relaxed mb-8">{car.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            <Spec icon={<Settings className="w-4 h-4" />} label="Transmission" value={car.transmission} />
            <Spec icon={<Users className="w-4 h-4" />} label="Seats" value={car.seats} />
            <Spec icon={<Fuel className="w-4 h-4" />} label="Fuel" value="Petrol" />
            <Spec icon={<Snowflake className="w-4 h-4" />} label="A/C" value="Yes" />
            <Spec icon={<MapPin className="w-4 h-4" />} label="Area" value={car.neighbourhood} />
            <Spec icon={<Calendar className="w-4 h-4" />} label="Year" value={car.year} />
          </div>

          {reviews.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                Reviews {avgRating && (
                  <span className="text-sm font-normal text-neutral-500 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-orange-400 text-orange-400" />{avgRating}
                  </span>
                )}
              </h2>
              <ul className="space-y-3">
                {reviews.map((review) => (
                  <li key={review.id} className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-orange-500 text-sm">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                      <span className="text-xs text-neutral-500">{formatDate(review.createdAt.slice(0, 10))}</span>
                    </div>
                    <p className="text-sm text-neutral-700">{review.comment}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-20 p-6 bg-white border border-neutral-200 rounded-2xl shadow-sm">
            <p className="text-4xl font-black text-indigo-600 mb-1">{etb.format(car.pricePerDay)}</p>
            <p className="text-xs text-neutral-500 mb-6">per day</p>

            <div className="space-y-2 text-sm text-neutral-600 mb-6 pb-6 border-b border-neutral-200">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-indigo-600" />{car.neighbourhood}, {car.city}</p>
              {owner && <p className="flex items-center gap-2"><Users className="w-4 h-4 text-indigo-600" />Owned by {owner.name}</p>}
            </div>

            {bookedRanges.length > 0 && (
              <div className="mb-6">
                <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Unavailable</p>
                <ul className="space-y-1 text-xs text-neutral-600">
                  {bookedRanges.map((r, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{formatDate(r.start)} – {formatDate(r.end)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Checkout still uses car.id — the checkout page looks up by id internally */}
            <Link
              href={`/checkout?car=${car.id}`}
              className="block w-full py-3 bg-orange-500 text-white font-semibold rounded-xl text-center hover:bg-orange-600 transition-colors mb-3"
            >
              Rent a car
            </Link>
            <Link
              href={`/cars/${carSlug}/map`}
              className="block w-full py-3 bg-white border border-neutral-200 text-neutral-700 font-semibold rounded-xl text-center hover:border-indigo-400 hover:text-indigo-600 transition-colors"
            >
              View Location on Map
            </Link>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Other cars in {car.neighbourhood}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similar.map((c) => <CarCard key={c.id} car={c} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function Spec({ icon, label, value }) {
  return (
    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
      <div className="flex items-center gap-2 text-neutral-500 text-xs mb-1">{icon}{label}</div>
      <p className="text-neutral-900 font-semibold capitalize">{value}</p>
    </div>
  );
}