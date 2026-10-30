import Link from "next/link";
import Image from "next/image";
import { etb } from "@/lib/format";
import { toCarSlug } from "@/lib/slug";
import { Settings, Users, Fuel, MapPin } from "lucide-react";

export default function CarCard({ car, priority = false }) {
  const slug = toCarSlug(car.make, car.model, car.year);
  return (
    <Link
      href={`/cars/${slug}`}
      className="group block bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all"
    >
      {/* Photo */}
      <div className="relative w-full h-48 bg-neutral-100 overflow-hidden">
        <Image
          src={car.photos[0]}
          alt={`${car.make} ${car.model}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          style={{ objectPosition: car.photoPosition || "center" }}
          priority={priority}
        />
        <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/95 text-neutral-700 flex items-center gap-1 z-10">
          <MapPin className="w-3 h-3 text-indigo-600" />
          {car.neighbourhood}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-neutral-900 group-hover:text-indigo-600 transition-colors">
            {car.make} {car.model}
          </h3>
          <div className="text-right shrink-0">
            <p className="text-indigo-600 font-bold">
              {etb.format(car.pricePerDay)}
            </p>
            <p className="text-xs text-neutral-500">per day</p>
          </div>
        </div>

        <p className="text-sm text-neutral-500 mb-4">
          {car.year} · {car.seats} seats
        </p>

        <div className="flex items-center gap-4 text-xs text-neutral-500 mb-4">
          <span className="flex items-center gap-1">
            <Settings className="w-3.5 h-3.5" />
            {car.transmission}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {car.seats}
          </span>
          <span className="flex items-center gap-1">
            <Fuel className="w-3.5 h-3.5" />
            Petrol
          </span>
        </div>

        <span className="block w-full py-2.5 bg-indigo-600 text-white text-center font-semibold rounded-xl text-sm group-hover:bg-indigo-700 transition-colors">
          View Details
        </span>
      </div>
    </Link>
  );
}