import { useState, useMemo, useContext, useRef, useEffect } from "react";
import { useFetch } from "./hooks/useFetch";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";
import { CartContext } from "./cart/CartProvider";

const cats = ["all", "starters", "mains", "soups", "desserts", "drinks"];

export default function Menu() {
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const { dispatch } = useContext(CartContext);
  const searchRef = useRef(null);

 
  const { data, loading, error } = useFetch("/dishes.json", [category]);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);


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
      <input ref={searchRef} type="text" placeholder="Search the menu..." className="search-input" />
      <CategoryBar categories={cats} selected={category} onSelect={setCategory} />
      <DishList dishes={shown} dispatch={dispatch} />
    </div>
  );
}