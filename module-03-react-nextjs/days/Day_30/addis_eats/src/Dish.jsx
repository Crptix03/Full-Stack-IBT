import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";

function Dish({ dish, onAdd }) {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`dish dish--${theme}`}>
      <h3>
        {dish.name} {dish.spicy && <span className="badge">🌶 Spicy</span>}
      </h3>
      <p>{dish.price} ETB</p>
      <div className="dish-actions">
        <button onClick={() => onAdd(dish)}>Add</button>
      </div>
    </div>
  );
}

export default Dish;