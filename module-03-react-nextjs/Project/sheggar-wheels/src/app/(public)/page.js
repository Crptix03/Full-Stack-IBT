import Link from "next/link";
import { readStorage, KEYS } from "@/lib/storage";
import CarCard from "@/components/CarCard";
import { Search, Shield, Zap, Wallet } from "lucide-react";

export const metadata = {
  title: "Home",
  description:
    "Rent a car from a trusted local owner in Addis Ababa. Peer-to-peer car rental, no dealerships.",
};

export default async function HomePage() {
  const cars = readStorage(KEYS.CARS, []);
  const approved = cars
    .filter((c) => c.status === "approved")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const neighbourhoods = [
    "Bole",
    "Kazanchis",
    "Megenagna",
    "Piassa",
    "CMC",
    "Saris",
  ];

  return (
    <div>
      {/* ── Purple hero panel ──────────────────────────── */}
      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-3xl bg-indigo-600 text-white overflow-hidden">
            {/* Background tint */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 20%, white 0%, transparent 40%), radial-gradient(circle at 80% 80%, white 0%, transparent 40%)",
              }}
            />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-16">
              {/* Left: message + CTA */}
              <div className="flex flex-col justify-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
                  Experience the road
                  <br />
                  <span className="text-orange-400">like never before.</span>
                </h1>
                <p className="text-indigo-100 text-lg max-w-md mb-8">
                  Rent a car directly from a trusted local owner in Addis
                  Ababa. No dealerships, no hidden fees, just cars owned by
                  people in your city.
                </p>
                <div>
                  <Link
                    href="/cars"
                    className="inline-block px-8 py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    View all cars
                  </Link>
                </div>
              </div>

              {/* Right: floating search card */}
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md bg-white text-neutral-900 rounded-2xl p-6 shadow-2xl">
                  <h2 className="text-xl font-bold mb-5">Find your car</h2>
                  <form
                    action="/cars"
                    method="GET"
                    className="space-y-3"
                  >
                    <select
                      name="neighbourhood"
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600"
                    >
                      <option value="all">Any neighbourhood</option>
                      {neighbourhoods.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>

                    <select
                      name="transmission"
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600"
                    >
                      <option value="all">Any transmission</option>
                      <option value="automatic">Automatic</option>
                      <option value="manual">Manual</option>
                    </select>

                    <select
                      name="seats"
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600"
                    >
                      <option value="">Any seats</option>
                      <option value="4">4+ seats</option>
                      <option value="5">5+ seats</option>
                      <option value="7">7+ seats</option>
                    </select>

                    <button
                      type="submit"
                      className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Search className="w-4 h-4" />
                      Search cars
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Three feature icons ────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Feature
            icon={<Shield className="w-10 h-10" />}
            title="Verified Owners"
            body="Every car is listed by a real person in Addis. No fleet companies, no fake accounts."
          />
          <Feature
            icon={<Wallet className="w-10 h-10" />}
            title="Fair Prices"
            body="Owners set their own rates. You see the total before you book. No hidden fees."
          />
          <Feature
            icon={<Zap className="w-10 h-10" />}
            title="Instant Booking"
            body="Request a car in seconds. Track every booking from request to return in one place."
          />
        </div>
      </section>

      {/* ── Featured cars ──────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-neutral-900">
              Choose the car that
              <br />
              suits you
            </h2>
          </div>
          <Link
            href="/cars"
            className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center gap-1 shrink-0"
          >
            View all →
          </Link>
        </div>

        {approved.length === 0 ? (
          <p className="text-neutral-500">
            No cars available yet. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approved.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>

      {/* ── Stats banner ───────────────────────────────── */}
      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl bg-indigo-600 text-white p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-black mb-8 text-center">
              Facts in Numbers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Stat value="540+" label="Cars" />
              <Stat value="20k+" label="Customers" />
              <Stat value="25+" label="Neighbourhoods" />
              <Stat value="2M+" label="Kilometres" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Demo disclaimer ────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-8 text-center">
        <p className="text-xs text-neutral-400">
          This is a demo project — no real cars, no real payments.
        </p>
      </section>
    </div>
  );
}

function Feature({ icon, title, body }) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-neutral-900 mb-2">{title}</h3>
      <p className="text-neutral-600 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="text-center">
      <p className="text-3xl md:text-4xl font-black text-orange-400 mb-1">
        {value}
      </p>
      <p className="text-indigo-100 text-sm">{label}</p>
    </div>
  );
}