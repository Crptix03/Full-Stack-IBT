"use client";

export default function CategoryBar({ categories, active, onSelect }) {
  return (
    <div className="category-bar">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelect?.(cat)}
          className={active === cat ? "cat-btn active" : "cat-btn"}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}