import { useEffect, useState, useRef } from "react";
import CategoryBar from "./CategoryBar";
import Dish from "./Dish";
import Card from "./Card";
import OrderForm from "./OrderForm";

export default function Menu() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("all");
  const [total, setTotal] = useState(0);

  const searchRef = useRef(null);
  const cats = ["all", "starters", "mains", "soups", "desserts", "drinks"];

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/dishes.json", { signal: controller.signal });
        if (!res.ok) throw new Error("Could not load the menu");
        const data = await res.json();
        const filtered = category === "all"
          ? data
          : data.filter(d => d.category === category);
        setDishes(filtered);
      } catch (e) {
        if (e.name === "AbortError") return;
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    load();

    return () => controller.abort();
  }, [category]);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  function handleAdd(price) {
    setTotal(t => t + price);
  }

  if (loading) return <p>Loading the menu...</p>;
  if (error) return <p className="err">{error}</p>;

  return (
    <div>
      <input
        ref={searchRef}
        type="text"
        placeholder="Search the menu..."
        className="search-input"
      />

      <CategoryBar categories={cats} selected={category} onSelect={setCategory} />

      {dishes.length === 0
        ? <p>No dishes in this category yet.</p>
        : (
          <div className="menu">
            {dishes.map(d => (
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