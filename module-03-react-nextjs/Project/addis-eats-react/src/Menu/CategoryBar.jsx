import { useFavoritesStore, selectFavoritesCount } from "../stores/useFavoritesStore";

const CATEGORY_LABELS = {
  all: "All Items",
  starters: "Starters",
  mains: "Main Course",
  soups: "Soups",
  desserts: "Desserts",
  drinks: "Drinks",
};

export default function CategoryBar({ categories, active, onSelect }) {
  const favoritesCount = useFavoritesStore(selectFavoritesCount);

  return (
    <div className="category-bar">
      {["all", ...categories].map((cat) => (
        <button
          key={cat}
          className={`cat-btn ${active === cat ? "active" : ""}`}
          onClick={() => onSelect(cat)}
        >
          {CATEGORY_LABELS[cat] || cat}
        </button>
      ))}
      <button
        className={`cat-btn ${active === "favorites" ? "active" : ""}`}
        onClick={() => onSelect("favorites")}
      >
        Favorites{favoritesCount > 0 ? ` (${favoritesCount})` : ""}
      </button>
    </div>
  );
}