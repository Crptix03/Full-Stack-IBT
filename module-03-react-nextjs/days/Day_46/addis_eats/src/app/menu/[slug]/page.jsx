import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDishes } from "@/lib/dishes";
import { toSlug } from "../slug";
import AddToCartButton from "../AddToCartButton";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const dishes = await getDishes();
  const dish = dishes.find((d) => toSlug(d.name) === slug);

  if (!dish) return { title: "Dish Not Found" };

  return {
    title: dish.name,
    description: dish.description,
    openGraph: {
      title: dish.name,
      description: dish.description,
      images: [
        { url: dish.image, width: 1200, height: 630, alt: dish.name },
      ],
    },
  };
}

export async function generateStaticParams() {
  const dishes = await getDishes();
  return dishes.map((dish) => ({ slug: toSlug(dish.name) }));
}

export default async function DishPage({ params }) {
  const { slug } = await params;
  const dishes = await getDishes();
  const dish = dishes.find((d) => toSlug(d.name) === slug);

  if (!dish) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.description,
    image: `${baseUrl}${dish.image}`,
    offers: {
      "@type": "Offer",
      price: dish.price,
      priceCurrency: "ETB",
      url: `${baseUrl}/menu/${slug}`,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mb-6">
        <Link
          href="/menu"
          className="text-amber-400 text-sm hover:underline inline-flex items-center gap-1"
        >
          ← Back to Menu
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image column */}
        <div className="relative w-full aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900">
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            fetchPriority="high"
            loading="eager"
          />
          {dish.tag && (
            <span
              className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full ${
                dish.tag === "Veg"
                  ? "bg-green-900/80 text-green-300"
                  : dish.tag === "Popular"
                  ? "bg-amber-500 text-neutral-900"
                  : "bg-neutral-800/90 text-neutral-200"
              }`}
            >
              {dish.tag}
            </span>
          )}
        </div>

        {/* Info column */}
        <div className="flex flex-col">
          <h1 className="font-serif text-4xl lg:text-5xl text-amber-400 leading-tight mb-3">
            {dish.name}
          </h1>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-semibold text-neutral-100">
              {dish.price} Birr
            </span>
            {dish.originalPrice && (
              <span className="text-neutral-500 text-lg line-through">
                {dish.originalPrice} Birr
              </span>
            )}
          </div>

          <p className="text-neutral-300 leading-relaxed mb-8">
            {dish.description}
          </p>

          {dish.ingredients?.length > 0 && (
            <div className="mb-8 pb-8 border-b border-neutral-800">
              <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">
                Ingredients
              </h2>
              <p className="text-neutral-400 text-sm leading-relaxed">
                {dish.ingredients.join(" · ")}
              </p>
            </div>
          )}

          <div className="mt-auto">
            <AddToCartButton dish={dish} />
          </div>
        </div>
      </div>
    </div>
  );
}