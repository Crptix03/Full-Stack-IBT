import Link from "next/link";
import { db } from "@/lib/db";
import CarCard from "@/components/CarCard";
import { Search, Shield, Zap, Wallet } from "lucide-react";

export default async function HomePage() {
  // Fetch featured cars directly from the server database
  const featured = db.cars.filter((c) => c.status === "approved").slice(0, 6);

  const neighbourhoods = [
    "Bole", "Kazanchis", "Megenagna", "Piassa", "CMC", "Saris",
  ];

  return (
    <div>
      <section className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-3xl bg-indigo-600 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 0%, transparent 40%), radial-gradient(circle at 80% 80%, white 0%, transparent 40%)" }} />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-16">
              <div className="flex flex-col justify-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
                  Experience the road<br /><span className="text-orange-400">like never before.</span>
                </h1>
                <p className="text-indigo-100 text-lg max-w-md mb-8">
                  Rent a car directly from a trusted local owner in Addis Ababa. No dealerships, no hidden fees, just cars owned by people in your city.
                </p>
                <div>
                  <Link href="/cars" className="inline-block px-8 py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors">
                    View all cars
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md bg-white text-neutral-900 rounded-2xl p-6 shadow-2xl">
                  <h2 className="text-xl font-bold mb-5">Find your car</h2>
                  <form action="/cars" method="GET" className="space-y-3">
                    <select name="neighbourhood" className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600">
                      <option value="all">Any neighbourhood</option>
                      {neighbourhoods.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <select name="transmission" className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600">
                      <option value="all">Any transmission</option>
                      <option value="automatic">Automatic</option>
                      <option value="manual">Manual</option>
                    </select>
                    <button type="submit" className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                      <Search className="w-4 h-4" /> Search cars
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-4"><Shield className="w-10 h-10" /></div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Verified Owners</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">Every car is listed by a real person in Addis. No fleet companies, no fake accounts.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-4"><Wallet className="w-10 h-10" /></div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Fair Prices</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">Owners set their own rates. You see the total before you book. No hidden fees.</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-4"><Zap className="w-10 h-10" /></div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2">Instant Booking</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">Request a car in seconds. Track every booking from request to return in one place.</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-neutral-900">Choose the car that<br />suits you</h2>
          </div>
          <Link href="/cars" className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center gap-1 shrink-0">View all →</Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((car) => <CarCard key={car.id} car={car} />)}
          </div>
        ) : (
          <p className="text-neutral-500">No cars available yet. Check back soon.</p>
        )}
      </section>

      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl bg-indigo-600 text-white p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-black mb-8 text-center">Facts in Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center"><p className="text-3xl md:text-4xl font-black text-orange-400 mb-1">540+</p><p className="text-indigo-100 text-sm">Cars</p></div>
              <div className="text-center"><p className="text-3xl md:text-4xl font-black text-orange-400 mb-1">20k+</p><p className="text-indigo-100 text-sm">Customers</p></div>
              <div className="text-center"><p className="text-3xl md:text-4xl font-black text-orange-400 mb-1">25+</p><p className="text-indigo-100 text-sm">Neighbourhoods</p></div>
              <div className="text-center"><p className="text-3xl md:text-4xl font-black text-orange-400 mb-1">2M+</p><p className="text-indigo-100 text-sm">Kilometres</p></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}