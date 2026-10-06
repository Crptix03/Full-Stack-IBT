import Image from "next/image";
import Link from "next/link";
import { toSlug } from "./slug";

export default function DishCard({ dish, isFirst = false }) {
  return (
    <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900 hover:border-amber-400/50 transition-colors group">
      <Link href={`/menu/${toSlug(dish.name)}`} className="block">
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            fetchPriority={isFirst ? "high" : "auto"}
            loading={isFirst ? "eager" : "lazy"}
          />

          {dish.tag && (
            <span
              className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded ${
                dish.tag === "Veg"
                  ? "bg-green-900/80 text-green-300"
                  : dish.tag === "Popular"
                  ? "bg-amber-500/90 text-neutral-900"
                  : "bg-neutral-800/90 text-neutral-200"
              }`}
            >
              {dish.tag}
            </span>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-serif font-medium text-lg text-neutral-100 mb-1 group-hover:text-amber-400 transition-colors">
            {dish.name}
          </h3>

          {dish.description && (
            <p className="text-neutral-400 text-xs mb-3 line-clamp-2">
              {dish.description}
            </p>
          )}

          <div className="flex items-baseline gap-2">
            <span className="text-amber-400 font-semibold">
              {dish.price} Birr
            </span>
            {dish.originalPrice && (
              <span className="text-neutral-500 text-xs line-through">
                {dish.originalPrice} Birr
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}