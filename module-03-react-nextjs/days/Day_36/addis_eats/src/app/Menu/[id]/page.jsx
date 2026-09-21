import Link from "next/link";
import { notFound } from "next/navigation";

const validDishIds = ["d1", "d2", "d3", "d4"];

export default async function DishPage({ params }) {
  const { id } = await params;

  if (!validDishIds.includes(id)) {
    notFound();
  }

  return (
    <div className="dish-page">
      <h1>Dish: {id}</h1>
      <p>This is the page for dish id: {id}</p>
      <Link href="/Menu">← Back to Menu</Link>
    </div>
  );
}