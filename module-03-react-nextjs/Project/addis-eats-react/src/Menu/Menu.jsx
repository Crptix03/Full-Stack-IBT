import { useState, useMemo, useCallback } from "react";
import { useFetch } from "../hooks/useFetch";
import { getDishes } from "../api/dishes";
import { useCart } from "../context/CartContext";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";

export default function Menu() {
  const fetcher = useCallback(() => getDishes(), []);
  const { data: dishes, loading, error } = useFetch(fetcher);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();

  const categories = useMemo(() => {
    if (!dishes) return [];
    return [...new Set(dishes.map((d) => d.category))];
  }, [dishes]);

  const filteredDishes = useMemo(() => {
    if (!dishes) return [];

    let result = dishes;

    if (activeCategory !== "all") {
      result = result.filter((d) => d.category === activeCategory);
    }

    const term = searchTerm.trim().toLowerCase();
    if (term) {
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(term) ||
          d.description.toLowerCase().includes(term)
      );
    }

    return result;
  }, [dishes, activeCategory, searchTerm]);

    const handleAdd = (dish) => {
      addToCart(dish);
    };

  return (
    <section className="menu">
      <div className="title-band">
        <h1 className="serif">
          Our Dining <em>Menu</em>
        </h1>
        <div className="rule" />
      </div>

      {/* Sticks below the header while the dish grid scrolls */}
      <div className="sticky-filters">
        <div className="search-wrap">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search menu items or ingredients…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="search-clear"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          )}
        </div>

        <CategoryBar
          categories={categories}
          active={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>

      <DishList
        dishes={filteredDishes}
        loading={loading}
        error={error}
        onAdd={handleAdd}
      />
    </section>
  );
}