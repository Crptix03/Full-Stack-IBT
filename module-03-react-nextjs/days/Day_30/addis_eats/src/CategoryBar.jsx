function CategoryBar({ categories, selected, onSelect }) {
  return (
    <nav className="category-filter">
      {categories.map(c => (
        <button
          key={c}
          className={c === selected ? "active" : ""}
          onClick={() => onSelect(c)}
        >
          {c}
        </button>
      ))}
    </nav>
  );
}

export default CategoryBar;