import Link from "next/link";
import { db } from "@/lib/db";
import CarCard from "@/components/CarCard";

export const metadata = {
  title: "Browse Cars",
  description: "Find the perfect car for your trip in Addis Ababa.",
};

const PAGE_SIZE = 9;

export default async function CarsPage({ searchParams }) {
  // Await searchParams (Next.js 15+)
  const params = await searchParams;

  const q = (params.q || "").trim().toLowerCase();
  const neighbourhood = params.neighbourhood || "all";
  const transmission = params.transmission || "all";
  const seats = params.seats ? parseInt(params.seats, 10) : null;
  const maxPrice = params.max ? parseInt(params.max, 10) : null;
  const sort = params.sort || "newest";
  const page = Math.max(1, parseInt(params.page, 10) || 1);

  // Query the server database
  let filtered = db.cars.filter((c) => c.status === "approved");

  if (q) {
    filtered = filtered.filter(
      (c) =>
        `${c.make} ${c.model}`.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    );
  }

  if (neighbourhood !== "all") {
    filtered = filtered.filter((c) => c.neighbourhood === neighbourhood);
  }

  if (transmission !== "all") {
    filtered = filtered.filter((c) => c.transmission === transmission);
  }

  if (seats) {
    filtered = filtered.filter((c) => c.seats >= seats);
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
    case "newest":
    default:
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageCars = filtered.slice(start, start + PAGE_SIZE);

  // Helper to build URL with current filters
  const buildQuery = (newPage) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (neighbourhood !== "all") p.set("neighbourhood", neighbourhood);
    if (transmission !== "all") p.set("transmission", transmission);
    if (seats) p.set("seats", String(seats));
    if (maxPrice !== null) p.set("max", String(maxPrice));
    if (sort !== "newest") p.set("sort", sort);
    if (newPage > 1) p.set("page", String(newPage));
    const qs = p.toString();
    return `/cars${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-neutral-900 mb-2">
          Browse Cars
        </h1>
        <p className="text-neutral-600 text-sm">
          {filtered.length} car{filtered.length === 1 ? "" : "s"} available.
        </p>
      </div>

      {/* Filters */}
      <form method="GET" className="mb-10 p-5 bg-white border border-neutral-200 rounded-2xl grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <input type="text" name="q" defaultValue={q} placeholder="Search..." className="px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm" />
        
        <select name="neighbourhood" defaultValue={neighbourhood} className="px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm">
          <option value="all">All areas</option>
          <option value="Bole">Bole</option>
          <option value="Kazanchis">Kazanchis</option>
          <option value="Megenagna">Megenagna</option>
          <option value="Piassa">Piassa</option>
          <option value="CMC">CMC</option>
        </select>

        <select name="transmission" defaultValue={transmission} className="px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm">
          <option value="all">Any transmission</option>
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
        </select>

        <select name="sort" defaultValue={sort} className="px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm">
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>

        <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl text-sm hover:bg-indigo-700">
          Apply Filters
        </button>
      </form>

      {/* Results */}
      {pageCars.length === 0 ? (
        <div className="text-center py-20 bg-white border border-neutral-200 rounded-2xl">
          <p className="text-neutral-600 mb-3">No cars match your filters.</p>
          <Link href="/cars" className="text-indigo-600 font-semibold hover:underline">Clear filters</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {pageCars.map((car, index) => (
              <CarCard key={car.id} car={car} priority={index === 0} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="flex justify-center gap-2">
              {safePage > 1 && (
                <Link href={buildQuery(safePage - 1)} className="px-4 py-2 border border-neutral-200 rounded-xl text-sm hover:border-indigo-400">← Prev</Link>
              )}
              <span className="px-4 py-2 text-neutral-600 text-sm">Page {safePage} of {totalPages}</span>
              {safePage < totalPages && (
                <Link href={buildQuery(safePage + 1)} className="px-4 py-2 border border-neutral-200 rounded-xl text-sm hover:border-indigo-400">Next →</Link>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}