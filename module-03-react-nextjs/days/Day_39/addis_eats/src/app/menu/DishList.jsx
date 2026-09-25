import Link from "next/link";
import { toSlug } from "./slug";

export default function DishList({ dishes }) {
  if (!dishes || dishes.length === 0) {
    return <p className="text-neutral-400">No dishes match your search.</p>;
  }

  return (
    <ul className="list-none p-0 m-0">
      {dishes.map((dish) => (
        <li
          key={dish.id}
          className="py-3 border-b border-neutral-800 last:border-b-0"
        >
          <Link
            href={`/menu/${toSlug(dish.name)}`}
            className="flex items-baseline gap-2 text-neutral-100 hover:text-amber-400 transition-colors"
          >
            <strong className="font-serif font-medium">{dish.name}</strong>
            <span className="text-neutral-400 text-sm">— {dish.price} Birr</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}