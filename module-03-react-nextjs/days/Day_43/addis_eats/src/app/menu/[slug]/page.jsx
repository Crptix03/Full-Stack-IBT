import Image from "next/image";
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
    // Added max-width and margin auto to center the content within the layout
    <div className="max-w-2xl mx-auto">
      {/* Image Container - fixed height for consistency */}
      <div className="relative w-full h-80 mb-8 rounded-lg overflow-hidden border border-neutral-800">
        <Image
          src={dish.image}
          alt={dish.name}
          fill
          sizes="(max-width: 768px) 100vw, 672px"
          className="object-cover"
          priority
        />
      </div>

      {/* Dish Info */}
      <div className="space-y-4">
        <h1 className="font-serif text-4xl text-amber-400">
          {dish.name}
        </h1>
        
        <p className="text-neutral-400 text-lg">
          {dish.price} Birr
        </p>

        {/* Add to Cart Button */}
        <div className="pt-4">
          <AddToCartButton dish={dish} />
        </div>
      </div>

      {/* Back Link */}
      <div className="mt-12 pt-6 border-t border-neutral-800">
        <Link 
          href="/menu" 
          className="text-amber-400 text-sm hover:underline inline-flex items-center gap-2"
        >
          ← Back to Menu
        </Link>
      </div>
    </div>
  );
}