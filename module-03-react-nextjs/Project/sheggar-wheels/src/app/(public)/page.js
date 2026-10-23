import Link from "next/link";
import { readStorage, KEYS } from "@/lib/storage";

export const metadata = {
  title: "Home",
};

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="font-serif text-5xl md:text-6xl text-neutral-100 mb-6">
          Rent a car from a{" "}
          <span className="text-amber-400">trusted local owner.</span>
        </h1>
        <p className="text-lg text-neutral-400 mb-8">
          Peer-to-peer car rental in Addis Ababa. No dealerships, no hidden
          fees, just cars owned by people in your city.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/cars"
            className="px-8 py-3 bg-amber-400 text-neutral-900 font-semibold rounded-lg hover:bg-amber-300 transition-colors"
          >
            Browse Cars
          </Link>
          <Link
            href="/signin"
            className="px-8 py-3 border border-neutral-700 text-neutral-200 rounded-lg hover:border-amber-400 hover:text-amber-400 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border border-neutral-800 rounded-lg bg-neutral-900/40">
          <h3 className="font-serif text-lg text-amber-400 mb-2">
            Verified owners
          </h3>
          <p className="text-sm text-neutral-400">
            Every car is listed by a real person in Addis. No fleet companies.
          </p>
        </div>
        <div className="p-6 border border-neutral-800 rounded-lg bg-neutral-900/40">
          <h3 className="font-serif text-lg text-amber-400 mb-2">
            Fair prices
          </h3>
          <p className="text-sm text-neutral-400">
            Owners set their own rates. You see the total before you book.
          </p>
        </div>
        <div className="p-6 border border-neutral-800 rounded-lg bg-neutral-900/40">
          <h3 className="font-serif text-lg text-amber-400 mb-2">
            Transparent bookings
          </h3>
          <p className="text-sm text-neutral-400">
            Track every request from booking to return in one place.
          </p>
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-xs text-neutral-600">
          This is a demo project — no real cars, no real payments.
        </p>
      </div>
    </div>
  );
}