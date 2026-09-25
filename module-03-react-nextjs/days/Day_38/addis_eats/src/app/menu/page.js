import DishList from "./DishList";
import FilterShell from "./FilterShell";

export const revalidate = 3600;

async function getDishes() {
  return [
    { id: "d1", name: "Crispy Sambusa", price: 100, category: "Starters" },
    { id: "d2", name: "Steak & Fries", price: 3000, category: "Mains" },
    { id: "d3", name: "Big Smokey Burger", price: 750, category: "Mains" },
    { id: "d4", name: "Honey Baklava", price: 250, category: "Desserts" },
  ];
}

export default async function MenuPage() {
  const dishes = await getDishes();

  return (
    <div>
      <h1 className="font-serif text-3xl text-amber-400 mb-6">
        Our Menu
      </h1>
      <FilterShell>
        <DishList dishes={dishes} />
      </FilterShell>
    </div>
  );
}