import Link from "next/link";
import { etb } from "@/lib/format";

export default function CarCard({ car }) {
  return (
    <Link
      href={`/cars/${car.id}`}
      className="block border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900 hover:border-amber-400/50 transition-colors group"
    >
      <div className="relative w-full h-48 bg-neutral-800 overflow-hidden">
        <img
          src={car.photos[0] || "/cars/placeholder.jpg"}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "/cars/placeholder.jpg";
          }}
        />
        <span className="absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded bg-neutral-950/80 text-neutral-200">
          {car.neighbourhood}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-serif font-medium text-lg text-neutral-100 mb-1 group-hover:text-amber-400 transition-colors">
          {car.make} {car.model}
        </h3>
        <p className="text-xs text-neutral-500 mb-3">
          {car.year} · {car.transmission} · {car.seats} seats
        </p>
        <div className="flex items-baseline justify-between">
          <span className="text-amber-400 font-semibold">
            {etb.format(car.pricePerDay)}
          </span>
          <span className="text-xs text-neutral-500">per day</span>
        </div>
      </div>
    </Link>
  );
}