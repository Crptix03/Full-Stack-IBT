import DishList from "./DishList";
import CategoryBar from "./CategoryBar";

const sampleDishes = [
  { id: "d1", name: "Crispy Sambusa", price: 100, category: "Starters" },
  { id: "d2", name: "Steak & Fries", price: 3000, category: "Mains" },
  { id: "d3", name: "Big Smokey Burger", price: 750, category: "Mains" },
  { id: "d4", name: "Honey Baklava", price: 250, category: "Desserts" },
];

const sampleCategories = ["All", "Starters", "Mains", "Desserts"];

export default function MenuPage() {
  // await new Promise((r) => setTimeout(r, 2000));
  // throw new Error("Test error for the exercise");
  return (
    <div className="menu-page">
      <h1>Our Menu</h1>
      <CategoryBar categories={sampleCategories} active="All" />
      <DishList dishes={sampleDishes} />
    </div>
  );
}