import { useState, useMemo, useContext, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useFetch } from "./hooks/useFetch";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";
import { CartContext } from "./cart/CartProvider";

const cats = ["all", "starters", "mains", "soups", "desserts", "drinks"];

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";

  const [sortBy, setSortBy] = useState("name");
  const { dispatch } = useContext(CartContext);
  const searchRef = useRef(null);

  const { data, loading, error } = useFetch("/dishes.json", [category]);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  function handleCategorySelect(c) {
    if (c === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: c });
    }
  }

  const shown = useMemo(() => {
    if (!data) return [];
    const byCategory = category === "all" ? data : data.filter(d => d.category === category);
    return [...byCategory].sort((a, b) =>
      sortBy === "price" ? a.price - b.price : a.name.localeCompare(b.name)
    );
  }, [data, category, sortBy]);

  if (loading) return <p>Loading the menu...</p>;
  if (error) return <p className="err">{error}</p>;

  return (
    <div>
      <h2>Our Menu</h2>
      <input ref={searchRef} type="text" placeholder="Search the menu..." className="search-input" />
      <CategoryBar categories={cats} selected={category} onSelect={handleCategorySelect} />
      <DishList dishes={shown} dispatch={dispatch} />
    </div>
  );
}