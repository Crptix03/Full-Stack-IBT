import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { getDishes } from "../api/dishes";
import { useCart } from "../context/CartContext";
import Spinner from "../ui/Spinner";
import DishModal from "../Menu/DishModal";

export default function BestFoods() {
  const fetcher = useCallback(() => getDishes(), []);
  const { data: dishes, loading, error } = useFetch(fetcher);
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null);

  const preview = dishes ? dishes.slice(0, 4) : [];

  const handleAdd = (e, dish) => {
    e.stopPropagation(); // ✅ Prevent modal from opening
    addToCart(dish);
    setAddedId(dish.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const handleOpen = (e, dish) => {
    // Ignore clicks on the add button
    if (e.target.closest(".bf-add-btn")) return;
    setSelectedDish(dish);
  };

  return (
    <section className="best-foods-wrap">
      <div className="best-foods">
        <div className="bf-header">
          <div>
            <div className="eyebrow">Fan Favorites</div>
            <h2 className="serif">Our Very Best Foods</h2>
            <p>A few of our most-ordered dishes, straight from the full menu.</p>
          </div>
          <Link to="/menu" className="bf-view-all">
            View All
          </Link>
        </div>

        {loading && <Spinner />}
        {error && <p className="error-text">Couldn't load dishes.</p>}

        {!loading && !error && (
          <div className="bf-grid">
            {preview.map((dish) => (
              <div
                className="bf-card"
                key={dish.id}
                onClick={(e) => handleOpen(e, dish)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setSelectedDish(dish);
                }}
              >
                <div className="bf-img">
                  <img src={`/${dish.img}`} alt={dish.name} />
                </div>

                <div className="bf-info">
                  <div className="bf-category">{dish.category}</div>
                  <div className="bf-name serif">{dish.name}</div>
                  <div className="bf-address">
                    Royale Bistro Kitchen
                    <br />
                    Bole Road, Addis Ababa
                  </div>
                </div>

                <div className="bf-rating">4.0 ★</div>

                <div className="bf-footer">
                  <div className="bf-price serif">
                    {dish.price} <span className="bf-price-currency">Birr</span>
                  </div>
                  <button
                    type="button"
                    className={`bf-add-btn ${addedId === dish.id ? "added" : ""}`}
                    onClick={(e) => handleAdd(e, dish)}
                  >
                    {addedId === dish.id ? "Added ✓" : "+ Add"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal rendered OUTSIDE the grid, still inside section */}
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