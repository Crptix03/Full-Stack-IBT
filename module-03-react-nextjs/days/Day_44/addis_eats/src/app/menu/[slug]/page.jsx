import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDishes } from "@/lib/dishes";
import { toSlug } from "../slug";
import AddToCartButton from "../AddToCartButton";

// ── Day 44: Dynamic Metadata ──────────────────────────
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const dishes = await getDishes();
  const dish = dishes.find((d) => toSlug(d.name) === slug);

  if (!dish) {
    return { title: "Dish Not Found" };
  }

  return {
    title: dish.name,
    description: `Order ${dish.name} for ${dish.price} Birr from Addis Eats.`,
    openGraph: {
      title: dish.name,
      description: `Order ${dish.name} for ${dish.price} Birr from Addis Eats.`,
      images: [
        {
          url: dish.image,
          width: 1200,
          height: 630,
          alt: dish.name,
        },
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

  // ── Day 44: JSON-LD Structured Data ─────────────────
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: `${dish.name} — available now at Addis Eats.`,
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
    <div className="max-w-3xl mx-auto">
      {/* Injects JSON-LD into the page source */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative w-full h-80 mb-8 rounded-lg overflow-hidden border border-neutral-800">
        <Image
          src={dish.image}
          alt={dish.name}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
          priority
        />
      </div>

      <div className="space-y-4">
        <h1 className="font-serif text-4xl text-amber-400">{dish.name}</h1>
        <p className="text-neutral-400 text-lg">{dish.price} Birr</p>
        <div className="pt-4">
          <AddToCartButton dish={dish} />
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-neutral-800">
        <Link href="/menu" className="text-amber-400 text-sm hover:underline">
          ← Back to Menu
        </Link>
      </div>
    </div>
  );
}