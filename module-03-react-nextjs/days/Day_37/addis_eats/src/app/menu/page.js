import { Suspense } from "react";
import DishList from "./DishList";

export const revalidate = 3600;

async function DishesAsync() {
  await new Promise((r) => setTimeout(r, 2000));   
  const dishes = [
    { id: "d1", name: "Crispy Sambusa", price: 100 },
    { id: "d2", name: "Steak & Fries", price: 3000 },
    { id: "d3", name: "Big Smokey Burger", price: 750 },
    { id: "d4", name: "Honey Baklava", price: 250 },
  ];
  return <DishList dishes={dishes} />;
}

export default function MenuPage() {
  return (
    <div className="menu-page">
      <h1>Our Menu</h1>
      <Suspense fallback={<p>Loading dishes…</p>}>
        <DishesAsync />
      </Suspense>
    </div>
  );
}