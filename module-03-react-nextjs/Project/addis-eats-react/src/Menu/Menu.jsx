import { useState, useMemo, useRef, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useMenu } from "../context/MenuContext";
import { useCart } from "../context/CartContext";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";
import DishModal from "./DishModal";
import { useFavorites } from "../context/FavoritesContext";

export default function Menu() {
  const { dishes, categories, loading, error } = useMenu();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDish, setSelectedDish] = useState(null); 

  const { addToCart } = useCart();
  const { favorites } = useFavorites();
  const location = useLocation();
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (location.state?.focusSearch && searchInputRef.current) {
      searchInputRef.current.focus({ preventScroll: true });
    }
  }, [location.state]);

  useEffect(() => {
    const urlCategory = searchParams.get("category") || "all";
    if (urlCategory !== activeCategory) {
      setActiveCategory(urlCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (category === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const filteredDishes = useMemo(() => {
    if (!dishes) return [];
    let result = dishes.filter((d) => !d.isHidden);
    if (activeCategory === "favorites") {
      result = result.filter((d) => favorites.includes(d.id));
    } else if (activeCategory !== "all") {
      result = result.filter((d) => d.category === activeCategory);
    }
    const term = searchTerm.trim().toLowerCase();
    if (term) {
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(term) ||
          d.description.toLowerCase().includes(term)
      );
    }
    return result;
  }, [dishes, activeCategory, searchTerm, favorites]);

  return (
    <section className="menu">
      <div className="title-band">
        <h1 className="serif">
          Our Dining <em>Menu</em>
        </h1>
        <div className="rule" />
      </div>

      <div className="sticky-filters">
        <div className="search-wrap">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search menu items or ingredients…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <CategoryBar
          categories={categories}
          active={activeCategory}
          onSelect={handleCategoryChange}
        />
      </div>

      <DishList
        dishes={filteredDishes}
        loading={loading}
        error={error}
        onAdd={addToCart}
        onOpen={setSelectedDish}
      />

      {/* Modal renders only when a dish is selected */}
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