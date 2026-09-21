import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found-state">
      <h2>Dish not found</h2>
      <p>We couldn&apos;t find that dish on our menu.</p>
      <Link href="/Menu">Back to Menu</Link>
    </div>
  );
}