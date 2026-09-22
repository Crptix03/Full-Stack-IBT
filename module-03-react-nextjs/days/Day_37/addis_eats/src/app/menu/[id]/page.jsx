import Link from "next/link";
import { notFound } from "next/navigation";

const dishes = [
  { id: "d1", name: "Crispy Sambusa", price: 100 },
  { id: "d2", name: "Steak & Fries", price: 3000 },
  { id: "d3", name: "Big Smokey Burger", price: 750 },
  { id: "d4", name: "Honey Baklava", price: 250 },
];

export async function generateStaticParams() {
  return dishes.map((dish) => ({ id: dish.id }));
}

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = dishes.find((d) => d.id === id);

  if (!dish) notFound();

  return (
    <div className="dish-page">
      <h1>{dish.name}</h1>
      <p>{dish.price} Birr</p>
      <Link href="/menu">← Back to Menu</Link>
    </div>
  );
}