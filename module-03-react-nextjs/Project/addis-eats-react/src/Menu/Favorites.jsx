import { Link } from "react-router-dom";
import { useMenuStore } from "../stores/useMenuStore";
import { useFavoritesStore } from "../stores/useFavoritesStore";
import { useCartStore } from "../stores/useCartStore";
import DishCard from "./DishCard";
import Spinner from "../ui/Spinner";
import { useState } from "react";
import DishModal from "./DishModal";

export default function Favorites() {
  const dishes = useMenuStore((s) => s.dishes);
  const loading = useMenuStore((s) => s.loading);
  const error = useMenuStore((s) => s.error);

  const favorites = useFavoritesStore((s) => s.favorites);
  const addToCart = useCartStore((s) => s.addToCart);
  const [selectedDish, setSelectedDish] = useState(null);

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