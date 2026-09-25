import Link from "next/link";

export default function CartPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl text-amber-400 mb-4">
        Your Cart
      </h1>
      <p className="text-neutral-400 mb-6">Cart items will go here.</p>
      <Link href="/" className="text-amber-400 text-sm hover:underline">
        ← Home
      </Link>
    </div>
  );
}