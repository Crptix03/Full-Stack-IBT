import DishCard from "./DishCard";
import Spinner from "../ui/Spinner";

export default function DishList({ dishes, loading, error, onAdd, onOpen }) {
  if (loading) return <Spinner />;
  if (error) return <p className="error-text">Couldn't load the menu. Try again.</p>;
  if (!dishes || dishes.length === 0) {
    return <p className="empty-text">No dishes match — try a different search or category.</p>;
  }

  return (
    <div className="dish-grid">
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} onAdd={onAdd} onOpen={onOpen} />
      ))}
    </div>
  );
}