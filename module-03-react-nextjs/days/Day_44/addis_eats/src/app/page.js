import Link from "next/link";

export const metadata = {
  title: "Home",
  description:
    "Welcome to Addis Eats. Browse our menu and order your favorite dishes for delivery.",
};

export default function HomePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-4xl text-amber-400 mb-4">
        Great Food, Delivered Fresh
      </h1>
      <p className="text-neutral-400 mb-8">
        Welcome to Addis Eats. Explore our menu and order your favorites
        for delivery.
      </p>
      <nav className="flex flex-wrap gap-3">
        <Link
          href="/menu"
          className="px-5 py-2 border border-neutral-700 rounded text-amber-400 text-sm hover:bg-amber-400 hover:text-neutral-900 transition-colors"
        >
          Browse Menu
        </Link>
        <Link
          href="/cart"
          className="px-5 py-2 border border-neutral-700 rounded text-amber-400 text-sm hover:bg-amber-400 hover:text-neutral-900 transition-colors"
        >
          View Cart
        </Link>
        <Link
          href="/checkout"
          className="px-5 py-2 border border-neutral-700 rounded text-amber-400 text-sm hover:bg-amber-400 hover:text-neutral-900 transition-colors"
        >
          Checkout
        </Link>
      </nav>
    </div>
  );
}