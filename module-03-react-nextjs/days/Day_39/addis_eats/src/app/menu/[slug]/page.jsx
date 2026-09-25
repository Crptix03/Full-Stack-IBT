import Link from "next/link";
import { notFound } from "next/navigation";
import { toSlug } from "../slug";

const dishes = [
  { id: "d1", name: "Crispy Sambusa", price: 100 },
  { id: "d2", name: "Steak & Fries", price: 3000 },
  { id: "d3", name: "Big Smokey Burger", price: 750 },
  { id: "d4", name: "Honey Baklava", price: 250 },
];

export async function generateStaticParams() {
  return dishes.map((dish) => ({ slug: toSlug(dish.name) }));
}

export default async function DishPage({ params }) {
  const { slug } = await params;

  const dish = dishes.find((d) => toSlug(d.name) === slug);

  if (!dish) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl text-amber-400 mb-4">
        {dish.name}
      </h1>
      <p className="text-neutral-400 mb-6">{dish.price} Birr</p>
      <Link href="/menu" className="text-amber-400 text-sm hover:underline">
        ← Back to Menu
      </Link>
    </div>
  );
}