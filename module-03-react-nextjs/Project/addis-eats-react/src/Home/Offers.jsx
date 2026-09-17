import { useState } from "react";
import { Link } from "react-router-dom";
import { useMenuStore } from "../stores/useMenuStore";
import { useCartStore } from "../stores/useCartStore";
import Spinner from "../ui/Spinner";
import DishModal from "../Menu/DishModal";

export default function Offers() {
  const allDishes = useMenuStore((s) => s.dishes);
  const loading = useMenuStore((s) => s.loading);
  const error = null;

  const dishes = allDishes.filter((d) => !d.isHidden);

  const addToCart = useCartStore((s) => s.addToCart);
  const [addedId, setAddedId] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null);

  const preview = dishes ? dishes.slice(4, 10) : [];

  const handleAdd = (dish) => {
    addToCart(dish);
    setAddedId(dish.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <section className="offers">
      <div className="offers-header">
        <div className="eyebrow">From Our Menu</div>
        <h2 className="serif">Try Our Special Offers</h2>
      </div>

      {loading && <Spinner />}
      {error && <p className="error-text">Couldn't load offers.</p>}

      {!loading && !error && (
        <div className="offer-list">
          {preview.map((dish) => (
            <div
              className="offer-row"
              key={dish.id}
              onClick={() => setSelectedDish(dish)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSelectedDish(dish);
              }}
            >
              <div className="offer-img">
                <img src={`/${dish.img}`} alt={dish.name} />

                {dish.originalPrice && dish.originalPrice > dish.price && (
                  <span className="offer-discount">
                    {Math.round(((dish.originalPrice - dish.price) / dish.originalPrice) * 100)}% OFF
                  </span>
                )}

                {dish.tag && <span className="offer-tag">{dish.tag}</span>}
              </div>
              <div className="offer-body">
                <div className="category">{dish.category}</div>
                <span className="name serif">{dish.name}</span>
                <span className="desc">{dish.description}</span>
                <div className="offer-footer">
                  <div className="offer-prices">
                    {dish.originalPrice && dish.originalPrice > dish.price ? (
                      <>
                        <span className="price-original serif">
                          {dish.originalPrice} <sup>Birr</sup>
                        </span>
                        <span className="price serif">
                          {dish.price} <sup>Birr</sup>
                        </span>
                      </>
                    ) : (
                      <span className="price serif">
                        {dish.price} <sup>Birr</sup>
                      </span>
                    )}
                  </div>
                  <button
                    className={`offer-add-btn ${addedId === dish.id ? "added" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdd(dish);
                    }}
                  >
                    {addedId === dish.id ? "Added ✓" : "+ Add"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="offers-footer">
        <Link to="/menu" className="btn-outline">
          View All Menu
        </Link>
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