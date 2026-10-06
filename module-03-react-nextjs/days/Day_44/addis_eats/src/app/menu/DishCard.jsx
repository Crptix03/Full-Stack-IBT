// Day_42/addis_eats/src/app/menu/DishCard.jsx
import Link from "next/link";
import { toSlug } from "./slug";

export default function DishCard({ dish }) {
  return (
    <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900">
      <Link href={`/menu/${toSlug(dish.name)}`} className="block">
        <div className="relative w-full h-48">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="font-serif font-medium text-lg text-neutral-100 mb-1">
            {dish.name}
          </h3>
          <p className="text-neutral-400 text-sm">{dish.price} Birr</p>
        </div>
      </Link>
    </div>
  );
}