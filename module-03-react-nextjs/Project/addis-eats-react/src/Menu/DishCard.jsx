import { memo } from "react";
import Button from "../ui/Button";
import { useFavorites } from "../context/FavoritesContext";

function DishCard({ dish, onAdd, onOpen }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(dish.id);

  // 🎬 Demo-only crash do /menu?crash=1 to trigger the error boundary.
  // Dead-code-eliminated in production builds (import.meta.env.DEV becomes false).
  if (
    import.meta.env.DEV &&
    dish.id &&
    new URLSearchParams(window.location.search).get("crash") === "1"
  ) {
    throw new Error("Demo: forced crash");
  }

  const hasDiscount =
    dish.originalPrice && dish.originalPrice > dish.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((dish.originalPrice - dish.price) / dish.originalPrice) * 100
      )
    : 0;

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // don't open modal
    toggleFavorite(dish.id);
  };

  return (
    <div
      className="dish-card"
      onClick={() => onOpen(dish)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen(dish);
      }}
    >
      <div className="dish-card-media">
        <img src={`/${dish.img}`} alt={dish.name} />

        {hasDiscount && (
          <span className="dish-discount-badge">
            {discountPercent}% OFF
          </span>
        )}

        {dish.tag && (
          <span className={`dish-tag dish-tag-${dish.tagClass || "default"}`}>
            {dish.tag}
          </span>
        )}

        {/* ❤️ Favorite button (bottom-right of image) */}
        <button
          className={`dish-fav-btn ${favorited ? "active" : ""}`}
          onClick={handleFavoriteClick}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          title={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <svg
            viewBox="0 0 24 24"
            fill={favorited ? "currentColor" : "none"}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <div className="dish-card-body">
        <h3 className="serif">{dish.name}</h3>
        <p>{dish.description}</p>

        <div className="dish-card-footer">
          <div className="dish-card-prices">
            {hasDiscount && (
              <span className="dish-price-original serif">
                {dish.originalPrice} <sup>Birr</sup>
              </span>
            )}
            <span className="dish-price serif">
              {dish.price} <sup>Birr</sup>
            </span>
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(dish);
            }}
          >
            + Add to Order
          </Button>
        </div>
      </div>
    </div>
  );
}

export default memo(DishCard);