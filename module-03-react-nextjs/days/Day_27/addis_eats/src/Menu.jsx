import { useState } from "react";
import Dish from "./Dish";
import Card from "./Card";
import menuData from "./data";

const categories = ["starters", "mains", "soups", "desserts", "drinks"];

function Menu() {
  const [category, setCategory] = useState("mains");

  const shown = menuData.filter(d => d.category === category);

  return (
    <div>
      <nav className="category-filter">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={c === category ? "active" : ""}
          >
            {c}
          </button>
        ))}
      </nav>

      {shown.length === 0 ? (
        <p>No {category} dishes.</p>
      ) : (
        <div className="menu">
          {shown.map(d => (
            <Card key={d.id}>
              <Dish name={d.name} price={d.price} spicy={d.spicy} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Menu;