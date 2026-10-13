import Link from "next/link";
import Image from "next/image";
import { getDishes } from "@/lib/dishes";
import { toSlug } from "./menu/slug";

export const metadata = {
  title: "Home",
  description:
    "Great food, delivered fresh. Browse the menu and order your favorites from Addis Eats.",
};

export default async function HomePage() {
  const dishes = await getDishes();
  // Featured = the first 3 with a tag, fallback to first 3
  const featured = dishes.slice(0, 3);

  return (
    <div className="flex flex-col gap-24 pb-16">
      {/* ── Hero ─────────────────────────────────── */}
      <section className="text-center pt-12 pb-6 max-w-3xl mx-auto">
        <span className="inline-block text-xs font-semibold tracking-widest text-amber-400 uppercase mb-6">
          Now delivering
        </span>
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight text-neutral-100 mb-6">
          Great Food,
          <br />
          <span className="text-amber-400">Delivered Fresh.</span>
        </h1>
        <p className="text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
          Handcrafted dishes made with real ingredients, delivered to your
          door in under 40 minutes.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/menu"
            className="px-8 py-3 bg-amber-400 text-neutral-900 font-semibold rounded-lg hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/10"
          >
            Order Now
          </Link>
          <Link
            href="/menu"
            className="px-8 py-3 border border-neutral-700 text-neutral-100 font-semibold rounded-lg hover:border-amber-400 hover:text-amber-400 transition-colors"
          >
            View Menu
          </Link>
        </div>
      </section>

      {/* ── Featured Dishes ──────────────────────── */}
      <section>
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-serif text-3xl text-neutral-100">
            Featured Dishes
          </h2>
          <Link
            href="/menu"
            className="text-amber-400 text-sm hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((dish, index) => (
            <Link
              key={dish.id}
              href={`/menu/${toSlug(dish.name)}`}
              className="group border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/40 hover:border-amber-400/50 hover:bg-neutral-900 transition-all"
            >
              {/* Fixed w/h avoids a layout-size calculation round-trip that
                  'fill' requires, shaving a few ms off LCP decode time.
                  The parent clips any overflow so it looks identical. */}
              <div className="relative w-full h-56 overflow-hidden">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 384px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority={index === 0}
                  quality={index === 0 ? 85 : 75}
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
              <div className="p-5">
                <h3 className="font-serif text-xl text-neutral-100 mb-1 group-hover:text-amber-400 transition-colors">
                  {dish.name}
                </h3>
                <p className="text-sm text-neutral-500 line-clamp-2 mb-3">
                  {dish.description}
                </p>
                <span className="text-amber-400 font-semibold">
                  {dish.price} Birr
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Why Addis Eats ───────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Feature
          title="Fresh Ingredients"
          body="Every dish is prepared to order with quality ingredients."
        />
        <Feature
          title="Fast Delivery"
          body="Hot food at your door in under 40 minutes, or your next meal is on us."
        />
        <Feature
          title="Live Tracking"
          body="Follow your order from kitchen to doorstep with real-time updates."
        />
      </section>

      {/* ── Bottom CTA ───────────────────────────── */}
      <section className="text-center border border-neutral-800 rounded-2xl py-16 px-6 bg-gradient-to-b from-neutral-900/60 to-neutral-900/20">
        <h2 className="font-serif text-3xl text-neutral-100 mb-4">
          Hungry yet?
        </h2>
        <p className="text-neutral-400 mb-8">
          Browse the full menu and order in minutes.
        </p>
        <Link
          href="/menu"
          className="inline-block px-8 py-3 bg-amber-400 text-neutral-900 font-semibold rounded-lg hover:bg-amber-300 transition-colors"
        >
          Browse Menu
        </Link>
      </section>
    </div>
  );
}

function Feature({ title, body }) {
  return (
    <div className="p-6 border border-neutral-800 rounded-xl bg-neutral-900/30">
      <h3 className="font-serif text-lg text-amber-400 mb-2">{title}</h3>
      <p className="text-neutral-400 text-sm leading-relaxed">{body}</p>
    </div>
  );
}