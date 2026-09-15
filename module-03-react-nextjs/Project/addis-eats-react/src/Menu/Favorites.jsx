import { Link } from "react-router-dom";
import { useMenu } from "../context/MenuContext";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import DishCard from "./DishCard";
import Spinner from "../ui/Spinner";
import { useState } from "react";
import DishModal from "./DishModal";

export default function Favorites() {
  const { dishes, loading, error } = useMenu();
  const { favorites, removeFavorite } = useFavorites();
  const { addToCart } = useCart();
  const [selectedDish, setSelectedDish] = useState(null);

  // Filter dishes to only those that are favorited and not hidden
  const favoriteDishes = (dishes || []).filter(
    (d) => favorites.includes(d.id) && !d.isHidden
  );

  if (loading) return <Spinner />;
  if (error)
    return <p className="error-text">Couldn't load your favorites. Try again.</p>;

  if (favoriteDishes.length === 0) {
    return (
      <section className="placeholder-page">
        <div className="title-band">
          <h1 className="serif">
            Your <em>Favorites</em>
          </h1>
          <div className="rule" />
          <p className="placeholder-message">
            You haven't added any favorites yet. Browse the{" "}
            <Link to="/menu" style={{ color: "var(--color-primary)" }}>
              menu
            </Link>{" "}
            and tap the heart on dishes you love.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="menu">
      <div className="title-band">
        <h1 className="serif">
          Your <em>Favorites</em>
        </h1>
        <div className="rule" />
      </div>

      <div className="dish-grid">
        {favoriteDishes.map((dish) => (
          <DishCard
            key={dish.id}
            dish={dish}
            onAdd={addToCart}
            onOpen={setSelectedDish}
            onRemoveFavorite={removeFavorite}
          />
        ))}
      </div>

      {selectedDish && (
        <DishModal
          dish={selectedDish}
          onClose={() => setSelectedDish(null)}
          onAdd={addToCart}
        />
      )}
    </section>
  );
}