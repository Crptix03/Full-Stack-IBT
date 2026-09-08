import { useParams, Link } from "react-router-dom";
import { useFetch } from "./hooks/useFetch";
import { useCartStore } from "./cart/cartStore";

function DishDetail() {
  const { id } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const { data, loading, error } = useFetch("/dishes.json", [id]);

  if (loading) return <p>Loading dish...</p>;
  if (error) return <p className="err">{error}</p>;

  const dish = data?.find(d => d.id === id);
  if (!dish) {
    return (
      <div>
        <p>Dish not found.</p>
        <Link to="/">Back to the menu</Link>
      </div>
    );
  }

  return (
    <div className="dish-detail">
      <Link to="/" className="back-link">← Back to menu</Link>
      <h2>{dish.name} {dish.spicy && <span className="badge">🌶 Spicy</span>}</h2>
      <p className="dish-detail-price">{dish.price} ETB</p>
      <p className="dish-detail-category">Category: {dish.category}</p>
      <button onClick={() => addItem(dish)}>Add to cart</button>
    </div>
  );
}

export default DishDetail;