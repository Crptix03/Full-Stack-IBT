import Link from "next/link";
import { notFound } from "next/navigation";
import { readStorage, KEYS } from "@/lib/storage";
import { etb } from "@/lib/format";
import { formatDate } from "@/lib/format-date";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const cars = readStorage(KEYS.CARS, []);
  const car = cars.find((c) => c.id === id);
  if (!car) return { title: "Car Not Found" };
  return {
    title: `${car.make} ${car.model} (${car.year})`,
    description: car.description,
  };
}

export default async function CarDetailPage({ params }) {
  const { id } = await params;
  const cars = readStorage(KEYS.CARS, []);
  const bookings = readStorage(KEYS.BOOKINGS, []);
  const reviews = readStorage(KEYS.REVIEWS, []);

  const car = cars.find((c) => c.id === id);
  if (!car || car.status !== "approved") {
    notFound();
  }

  const owner = readStorage(KEYS.USERS, []).find((u) => u.id === car.ownerId);
  const carReviews = reviews.filter((r) => r.carId === car.id);
  const avgRating =
    carReviews.length > 0
      ? (
          carReviews.reduce((sum, r) => sum + r.rating, 0) / carReviews.length
        ).toFixed(1)
      : null;

  // Upcoming unavailable dates (booked or owner-blocked)
  const bookedRanges = bookings
    .filter(
      (b) =>
        b.carId === car.id &&
        ["confirmed", "in_progress"].includes(b.status)
    )
    .map((b) => ({ start: b.startDate, end: b.endDate }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/cars" className="text-amber-400 text-sm hover:underline">
          ← Back to Browse
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Photos + description */}
        <div className="lg:col-span-2">
          <div className="relative w-full h-80 rounded-xl overflow-hidden border border-neutral-800 mb-6">
            <img
              src={car.photos[0] || "/cars/placeholder.jpg"}
              alt={`${car.make} ${car.model}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/cars/placeholder.jpg";
              }}
            />
          </div>

          <h1 className="font-serif text-4xl text-amber-400 mb-2">
            {car.make} {car.model}
          </h1>
          <p className="text-neutral-400 mb-6">
            {car.year} · {car.transmission} · {car.seats} seats
          </p>

          <p className="text-neutral-300 leading-relaxed mb-6">
            {car.description}
          </p>

          {carReviews.length > 0 && (
            <div className="mb-6">
              <h2 className="font-serif text-xl text-neutral-100 mb-3">
                Reviews ({carReviews.length})
                {avgRating && (
                  <span className="text-amber-400 ml-2">★ {avgRating}</span>
                )}
              </h2>
              <ul className="space-y-3">
                {carReviews.slice(0, 3).map((review) => (
                  <li
                    key={review.id}
                    className="p-3 border border-neutral-800 rounded-lg bg-neutral-900/40"
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-amber-400 text-sm">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {formatDate(review.createdAt.slice(0, 10))}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-300">{review.comment}</p>
                    {review.ownerReply && (
                      <p className="text-xs text-neutral-500 mt-2 italic">
                        Owner replied: {review.ownerReply}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Booking sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-20 p-6 border border-neutral-800 rounded-xl bg-neutral-900/40">
            <p className="text-3xl text-amber-400 font-serif mb-1">
              {etb.format(car.pricePerDay)}
            </p>
            <p className="text-xs text-neutral-500 mb-6">per day</p>

            <div className="space-y-2 text-sm text-neutral-400 mb-6">
              <p>
                <span className="text-neutral-500">Location:</span>{" "}
                {car.neighbourhood}, {car.city}
              </p>
              {owner && (
                <p>
                  <span className="text-neutral-500">Owner:</span> {owner.name}
                </p>
              )}
            </div>

            {bookedRanges.length > 0 && (
              <div className="mb-6">
                <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
                  Unavailable
                </p>
                <ul className="space-y-1 text-xs text-neutral-400">
                  {bookedRanges.map((r, i) => (
                    <li key={i}>
                      {formatDate(r.start)} – {formatDate(r.end)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link
              href={`/checkout?car=${car.id}`}
              className="block w-full py-3 bg-amber-400 text-neutral-900 font-semibold rounded-lg text-center hover:bg-amber-300 transition-colors"
            >
              Book this car
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}