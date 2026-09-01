import { useState, useEffect, useRef } from "react";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";
import OrderForm from "./OrderForm";
import { loadDishes } from "./api";

export default function Menu() {
  const [category, setCategory] = useState("all");
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const searchRef = useRef(null);

  const cats = ["all", "starters", "mains", "soups", "desserts", "drinks"];

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    loadDishes(category, controller.signal)
      .then(data => {
        setDishes(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [category]);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  function handleAdd(price) {
    setTotal(t => t + price);
  }

  if (loading) return <p>Loading menu...</p>;
  if (error) return <p className="field-error">Could not load menu: {error}</p>;

  return (
    <div>
      <input
        ref={searchRef}
        type="text"
        placeholder="Search the menu..."
        className="search-input"
      />

      <CategoryBar categories={cats} selected={category} onSelect={setCategory} />

      <DishList dishes={dishes} onAdd={handleAdd} />

      <div className="order-total">
        Order total: <strong>{total} ETB</strong>
      </div>

      <OrderForm />
    </div>
  );
}