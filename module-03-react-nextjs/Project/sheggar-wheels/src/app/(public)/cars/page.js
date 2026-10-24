"use client";

import Link from "next/link";
import { useEffect, useState, use } from "react";
import { readStorage, KEYS } from "@/lib/storage";
import CarCard from "@/components/CarCard";

const PAGE_SIZE = 9;

export default function CarsPage({ searchParams }) {
  const params = use(searchParams);

  const [allCars, setAllCars] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAllCars(readStorage(KEYS.CARS, []));
    setAllBookings(readStorage(KEYS.BOOKINGS, []));
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center text-neutral-500">
        Loading cars…
      </div>
    );
  }

  const q = (params.q || "").trim().toLowerCase();
  const neighbourhood = params.neighbourhood || "all";
  const transmission = params.transmission || "all";
  const seats = params.seats ? parseInt(params.seats, 10) : null;
  const minPrice = params.min ? parseInt(params.min, 10) : null;
  const maxPrice = params.max ? parseInt(params.max, 10) : null;
  const sort = params.sort || "newest";
  const page = Math.max(1, parseInt(params.page, 10) || 1);

  let filtered = allCars.filter((c) => c.status === "approved");

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

  if (minPrice !== null) {
    filtered = filtered.filter((c) => c.pricePerDay >= minPrice);
  }
  if (maxPrice !== null) {
    filtered = filtered.filter((c) => c.pricePerDay <= maxPrice);
  }

  switch (sort) {
    case "price-asc":
      filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
      break;
    case "price-desc":
      filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);
      break;
    case "popularity": {
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
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-neutral-900 mb-2">
          Browse Cars
        </h1>
        <p className="text-neutral-600 text-sm">
          {filtered.length} car{filtered.length === 1 ? "" : "s"} available in
          Addis Ababa.
        </p>
      </div>

      <form
        method="GET"
        className="mb-10 p-5 bg-white border border-neutral-200 rounded-2xl grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3"
      >
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search make or model…"
          className="px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
        />

        <select
          name="neighbourhood"
          defaultValue={neighbourhood}
          className="px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
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
          className="px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
        >
          <option value="all">Any transmission</option>
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
        </select>

        <select
          name="seats"
          defaultValue={seats || ""}
          className="px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
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
          className="px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
        />

        <div className="flex gap-2">
          <select
            name="sort"
            defaultValue={sort}
            className="flex-1 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="popularity">Popular</option>
          </select>
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl text-sm hover:bg-indigo-700 transition-colors"
          >
            Apply
          </button>
        </div>
      </form>

      {pageCars.length === 0 ? (
        <div className="text-center py-20 bg-white border border-neutral-200 rounded-2xl">
          <p className="text-neutral-600 mb-3">No cars match your filters.</p>
          <Link
            href="/cars"
            className="inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
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
            Showing {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length} cars
          </p>

          {totalPages > 1 && (
            <nav className="flex justify-center gap-2">
              {safePage > 1 && (
                <Link
                  href={buildQuery(safePage - 1)}
                  className="px-4 py-2 border border-neutral-200 rounded-xl text-neutral-700 text-sm hover:border-indigo-400 hover:text-indigo-600 transition-colors bg-white"
                >
                  ← Prev
                </Link>
              )}
              <span className="px-4 py-2 text-neutral-600 text-sm">
                Page {safePage} of {totalPages}
              </span>
              {safePage < totalPages && (
                <Link
                  href={buildQuery(safePage + 1)}
                  className="px-4 py-2 border border-neutral-200 rounded-xl text-neutral-700 text-sm hover:border-indigo-400 hover:text-indigo-600 transition-colors bg-white"
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