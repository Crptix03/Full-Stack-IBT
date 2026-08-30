import { useState } from "react";
import Dish from "./Dish";
import Card from "./Card";
import CategoryBar from "./CategoryBar";
import OrderForm from "./OrderForm";
import menuData from "./data";

export default function Menu() {
  const [category, setCategory] = useState("all");
  const [total, setTotal] = useState(0);

  const cats = ["all", "starters", "mains", "soups", "desserts", "drinks"];

  const shown = category === "all"
    ? menuData
    : menuData.filter(d => d.category === category);

  function handleAdd(price) {
    setTotal(t => t + price);
  }

  return (
    <div>
      <CategoryBar categories={cats} selected={category} onSelect={setCategory} />

      {shown.length === 0
        ? <p>No dishes in this category yet.</p>
        : (
          <div className="menu">
            {shown.map(d => (
              <Card key={d.id}>
                <Dish {...d} onAdd={handleAdd} />
              </Card>
            ))}
          </div>
        )}

      <div className="order-total">
        Order total: <strong>{total} ETB</strong>
      </div>

      <OrderForm />
    </div>
  );
}