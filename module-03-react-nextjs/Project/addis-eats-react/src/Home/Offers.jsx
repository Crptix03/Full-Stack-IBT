import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { getDishes } from "../api/dishes";
import { useCart } from "../context/CartContext";
import Spinner from "../ui/Spinner";

export default function Offers() {
  const fetcher = useCallback(() => getDishes(), []);
  const { data: dishes, loading, error } = useFetch(fetcher);
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState(null);

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
            <div className="offer-row" key={dish.id}>
              <div className="offer-img">
                <img src={`/${dish.img}`} alt={dish.name} />
                {dish.tag && <span className="offer-tag">{dish.tag}</span>}
              </div>
              <div className="offer-body">
                <div className="category">{dish.category}</div>
                <span className="name serif">{dish.name}</span>
                <span className="desc">{dish.description}</span>
                <div className="offer-footer">
                  <span className="price serif">
                    {dish.price} <sup>Birr</sup>
                  </span>
                  <button
                    className={`offer-add-btn ${addedId === dish.id ? "added" : ""}`}
                    onClick={() => handleAdd(dish)}
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
    </section>
  );
}