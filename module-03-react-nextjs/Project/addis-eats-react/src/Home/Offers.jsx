import { useState } from "react";
import { Link } from "react-router-dom";
import { useMenu } from "../context/MenuContext";
import { useCart } from "../context/CartContext";
import Spinner from "../ui/Spinner";
import DishModal from "../Menu/DishModal";

export default function Offers() {
  const { dishes: allDishes, loading } = useMenu();
  const error = null;

  //  Filter out hidden dishes (respects admin changes)
  const dishes = allDishes.filter((d) => !d.isHidden);

  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null); //  Modal state

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
              onClick={() => setSelectedDish(dish)}   //  Open modal
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSelectedDish(dish);
              }}
            >
              <div className="offer-img">
                <img src={`/${dish.img}`} alt={dish.name} />

                {/* Discount badge (top-LEFT to avoid clashing with the tag) */}
                {dish.originalPrice && dish.originalPrice > dish.price && (
                  <span className="offer-discount">
                    {Math.round(((dish.originalPrice - dish.price) / dish.originalPrice) * 100)}% OFF
                  </span>
                )}

                {/* Category tag (top-right) */}
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

      {/*  Modal */}
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