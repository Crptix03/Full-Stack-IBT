import Link from "next/link";
import { notFound } from "next/navigation";
import { getDishes } from "@/lib/dishes";
import { toSlug } from "../slug";
import AddToCartButton from "../AddToCartButton";

export async function generateStaticParams() {
  const dishes = await getDishes();
  return dishes.map((dish) => ({ slug: toSlug(dish.name) }));
}

export default async function DishPage({ params }) {
  const { slug } = await params;
  const dishes = await getDishes();

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

      
      <AddToCartButton dish={dish} />

      <div className="mt-6">
        <Link href="/menu" className="text-amber-400 text-sm hover:underline">
          ← Back to Menu
        </Link>
      </div>
    </div>
  );
}