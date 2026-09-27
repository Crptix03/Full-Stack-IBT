import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl text-amber-400 mb-4">
        Addis Eats
      </h1>
      <p className="text-neutral-400 mb-6">
        Welcome to our restaurant.
      </p>
      <nav className="flex flex-wrap gap-3">
        <Link
          href="/menu"
          className="px-5 py-2 border border-neutral-700 rounded text-amber-400 text-sm hover:bg-amber-400 hover:text-neutral-900 transition-colors"
        >
          Menu
        </Link>
        <Link
          href="/cart"
          className="px-5 py-2 border border-neutral-700 rounded text-amber-400 text-sm hover:bg-amber-400 hover:text-neutral-900 transition-colors"
        >
          Cart
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