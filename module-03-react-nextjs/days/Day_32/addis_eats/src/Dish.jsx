import { useContext } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { ThemeContext } from "./context/ThemeContext";

function Dish({ dish, onAdd }) {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`dish dish--${theme}`}>
      <Link to={`/menu/${dish.id}`} className="dish-link">
        <h3>
          {dish.name} {dish.spicy && <span className="badge">🌶 Spicy</span>}
        </h3>
        <p>{dish.price} ETB</p>
      </Link>
      <div className="dish-actions">
        <button onClick={() => onAdd(dish)}>Add</button>
      </div>
    </div>
  );
}

Dish.propTypes = {
  dish: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.string,
    spicy: PropTypes.bool,
  }).isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default Dish;