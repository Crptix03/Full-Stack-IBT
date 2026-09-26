import { useFavoritesStore } from "../stores/useFavoritesStore";
import { useReviewStore } from "../stores/useReviewStore";
import { useToastStore } from "../stores/useToastStore";
import StarRating from "../ui/StarRating";
import Modal from "../ui/Modal";

export default function DishModal({ dish, onClose, onAdd }) {
  const favorites = useFavoritesStore((s) => s.favorites);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  // ✅ Subscribe to ratings — re-renders when any rating changes
  const ratings = useReviewStore((s) => s.ratings);

  // ✅ Toast feedback
  const addToast = useToastStore((s) => s.addToast);

  if (!dish) return null;

  const favorited = favorites.includes(dish.id);

  // ── Average rating for this dish ────────────────────────
  const dishRatings = ratings.filter((r) => r.dishId === dish.id);
  const averageRating =
    dishRatings.length > 0
      ? dishRatings.reduce((sum, r) => sum + r.stars, 0) / dishRatings.length
      : 0;

  const hasDiscount =
    dish.originalPrice && dish.originalPrice > dish.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((dish.originalPrice - dish.price) / dish.originalPrice) * 100
      )
    : 0;

  const savedAmount = hasDiscount ? dish.originalPrice - dish.price : 0;

  const handleFavoriteToggle = () => {
    toggleFavorite(dish.id);

    // ✅ Toast — check old state before toggling
    if (favorited) {
      addToast({ message: "Removed from Favorites", type: "info" });
    } else {
      addToast({
        message: `${dish.name} added to Favorites ♥`,
        type: "success",
      });
    }
  };

  const handleAddToOrder = () => {
    onAdd(dish);
    addToast({ message: `${dish.name} added to Cart`, type: "success" });
    onClose();
  };

  return (
    <Modal onClose={onClose} labelledBy="dish-modal-title">
      <div className="dish-modal">
        <button
          className="dish-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="dish-modal-hero">
          <img
            src={
              typeof dish.img === "string" && dish.img.startsWith("/")
                ? dish.img
                : typeof dish.img === "string"
                ? `/${dish.img.replace(/^(Imgaes|Images|images)\//, "images/")}`
                : "/images/placeholder.jpg"
            }
            alt={dish.name}
          />

          {hasDiscount && (
            <span className="dish-modal-discount">
              {discountPercent}% OFF
            </span>
          )}

          {dish.tag && (
            <span className={`dish-modal-tag dish-tag-${dish.tagClass || "default"}`}>
              {dish.tag}
            </span>
          )}
        </div>

        <div className="dish-modal-body">
          <div className="dish-modal-header">
            <div>
              <span className="dish-modal-category">{dish.category}</span>
              <h2 className="serif" id="dish-modal-title">{dish.name}</h2>
            </div>

            <div className="dish-modal-prices">
              {hasDiscount && (
                <span className="dish-modal-original serif">
                  {dish.originalPrice} <sup>Birr</sup>
                </span>
              )}
              <span className="dish-modal-price serif">
                {dish.price} <sup>Birr</sup>
              </span>
            </div>
          </div>

          <p className="dish-modal-desc">{dish.description}</p>

          {/* ✅ Average rating — shown only if the dish has at least one rating */}
          {dishRatings.length > 0 && (
            <div className="dish-modal-rating">
              <StarRating value={averageRating} size={18} />
              <span className="dish-modal-rating-value">
                {averageRating.toFixed(1)}
              </span>
              <span className="dish-modal-rating-count">
                ({dishRatings.length}{" "}
                {dishRatings.length === 1 ? "rating" : "ratings"})
              </span>
            </div>
          )}

          <div className="dish-modal-section">
            <h3 className="serif">Ingredients</h3>
            {dish.ingredients && dish.ingredients.length > 0 ? (
              <ul className="dish-modal-ingredients">
                {dish.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            ) : (
              <p className="dish-modal-empty">
                Ingredients not available for this dish.
              </p>
            )}
          </div>

          <div className="dish-modal-actions">
            <button
              className={`dish-modal-fav ${favorited ? "active" : ""}`}
              onClick={handleFavoriteToggle}
              aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
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
              <span>{favorited ? "Favorited" : "Add to Favorites"}</span>
            </button>

            <button
              className="dish-modal-add"
              onClick={handleAddToOrder}
            >
              + Add to Order · {dish.price} Birr
              {hasDiscount && (
                <span className="dish-modal-save">
                  &nbsp;· Save {savedAmount} Birr
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}