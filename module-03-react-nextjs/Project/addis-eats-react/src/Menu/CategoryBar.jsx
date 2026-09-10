const CATEGORY_LABELS = {
  all: "All Items",
  starters: "Starters",
  mains: "Main Course",
  soups: "Soups",
  desserts: "Desserts",
  drinks: "Drinks",
};

export default function CategoryBar({ categories, active, onSelect }) {
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
    </div>
  );
}