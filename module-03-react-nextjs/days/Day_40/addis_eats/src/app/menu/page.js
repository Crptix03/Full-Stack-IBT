import DishList from "./DishList";
import FilterShell from "./FilterShell";
import { getDishes } from "@/lib/dishes";

export const revalidate = 3600;

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