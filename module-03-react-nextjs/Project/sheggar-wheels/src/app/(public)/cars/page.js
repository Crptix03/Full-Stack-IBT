import Link from "next/link";
import { readStorage, KEYS } from "@/lib/storage";
import CarCard from "@/components/CarCard";

export const metadata = {
  title: "Browse Cars",
  description:
    "Find the perfect car for your trip in Addis Ababa. Filter by neighbourhood, price, transmission, and seats.",
};

const PAGE_SIZE = 9;

export default async function CarsPage({ searchParams }) {
  const params = await searchParams;

  const q = (params.q || "").trim().toLowerCase();
  const neighbourhood = params.neighbourhood || "all";
  const transmission = params.transmission || "all";
  const seats = params.seats ? parseInt(params.seats, 10) : null;
  const minPrice = params.min ? parseInt(params.min, 10) : null;
  const maxPrice = params.max ? parseInt(params.max, 10) : null;
  const sort = params.sort || "newest";
  const page = Math.max(1, parseInt(params.page, 10) || 1);

  const allCars = readStorage(KEYS.CARS, []);
  const allBookings = readStorage(KEYS.BOOKINGS, []);

  // Only approved, active cars are public.
  let filtered = allCars.filter((c) => c.status === "approved");

  // Search
  if (q) {
    filtered = filtered.filter(
      (c) =>
        `${c.make} ${c.model}`.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    );
  }

  // Neighbourhood filter
  if (neighbourhood !== "all") {
    filtered = filtered.filter((c) => c.neighbourhood === neighbourhood);
  }

  // Transmission filter
  if (transmission !== "all") {
    filtered = filtered.filter((c) => c.transmission === transmission);
  }

  // Seats filter
  if (seats) {
    filtered = filtered.filter((c) => c.seats >= seats);
  }

  // Price range
  if (minPrice !== null) {
    filtered = filtered.filter((c) => c.pricePerDay >= minPrice);
  }
  if (maxPrice !== null) {
    filtered = filtered.filter((c) => c.pricePerDay <= maxPrice);
  }

  // Sort
  switch (sort) {
    case "price-asc":
      filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);
      break;
    case "popularity": {
      // Count confirmed/completed bookings per car
      const counts = new Map();
      for (const b of allBookings) {
        if (["confirmed", "in_progress", "completed"].includes(b.status)) {
          counts.set(b.carId, (counts.get(b.carId) || 0) + 1);
        }
      }
      filtered.sort(
        (a, b) => (counts.get(b.id) || 0) - (counts.get(a.id) || 0)
      );
      break;
    }
    case "newest":
    default:
      filtered.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageCars = filtered.slice(start, start + PAGE_SIZE);

  // Build the query string for pagination
  const buildQuery = (newPage) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (neighbourhood !== "all") p.set("neighbourhood", neighbourhood);
    if (transmission !== "all") p.set("transmission", transmission);
    if (seats) p.set("seats", String(seats));
    if (minPrice !== null) p.set("min", String(minPrice));
    if (maxPrice !== null) p.set("max", String(maxPrice));
    if (sort !== "newest") p.set("sort", sort);
    if (newPage > 1) p.set("page", String(newPage));
    const qs = p.toString();
    return `/cars${qs ? `?${qs}` : ""}`;
  };

  const neighbourhoods = [
    "all",
    "Bole",
    "Kazanchis",
    "Megenagna",
    "Piassa",
    "CMC",
    "Old Airport",
    "Saris",
    "Gerji",
    "Summit",
    "Ayat",
    "Lafto",
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl text-amber-400 mb-6">
        Browse Cars
      </h1>

      {/* Filters */}
      <form
        method="GET"
        className="mb-8 p-4 border border-neutral-800 rounded-lg bg-neutral-900/40 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3"
      >
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search make or model…"
          className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-neutral-100 text-sm focus:outline-none focus:border-amber-400"
        />

        <select
          name="neighbourhood"
          defaultValue={neighbourhood}
          className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-neutral-100 text-sm focus:outline-none focus:border-amber-400"
        >
          {neighbourhoods.map((n) => (
            <option key={n} value={n}>
              {n === "all" ? "All areas" : n}
            </option>
          ))}
        </select>

        <select
          name="transmission"
          defaultValue={transmission}
          className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-neutral-100 text-sm focus:outline-none focus:border-amber-400"
        >
          <option value="all">Any transmission</option>
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
        </select>

        <select
          name="seats"
          defaultValue={seats || ""}
          className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-neutral-100 text-sm focus:outline-none focus:border-amber-400"
        >
          <option value="">Any seats</option>
          <option value="4">4+ seats</option>
          <option value="5">5+ seats</option>
          <option value="7">7+ seats</option>
        </select>

        <input
          type="number"
          name="max"
          defaultValue={maxPrice || ""}
          placeholder="Max ETB / day"
          className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-neutral-100 text-sm focus:outline-none focus:border-amber-400"
        />

        <div className="flex gap-2">
          <select
            name="sort"
            defaultValue={sort}
            className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-neutral-100 text-sm focus:outline-none focus:border-amber-400"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="popularity">Most booked</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-amber-400 text-neutral-900 font-semibold rounded text-sm hover:bg-amber-300 transition-colors"
          >
            Apply
          </button>
        </div>
      </form>

      {/* Results */}
      {pageCars.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-neutral-400 mb-2">No cars match your filters.</p>
          <Link href="/cars" className="text-amber-400 text-sm hover:underline">
            Clear filters
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {pageCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          <p className="text-xs text-neutral-500 text-center mb-4">
            Showing {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length} cars
          </p>

          {totalPages > 1 && (
            <nav className="flex justify-center gap-2">
              {safePage > 1 && (
                <Link
                  href={buildQuery(safePage - 1)}
                  className="px-3 py-1.5 border border-neutral-700 rounded text-neutral-300 text-sm hover:border-amber-400 hover:text-amber-400 transition-colors"
                >
                  ← Prev
                </Link>
              )}
              <span className="px-3 py-1.5 text-neutral-400 text-sm">
                Page {safePage} of {totalPages}
              </span>
              {safePage < totalPages && (
                <Link
                  href={buildQuery(safePage + 1)}
                  className="px-3 py-1.5 border border-neutral-700 rounded text-neutral-300 text-sm hover:border-amber-400 hover:text-amber-400 transition-colors"
                >
                  Next →
                </Link>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}