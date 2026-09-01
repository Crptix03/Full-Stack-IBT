import { useState } from "react";
import PropTypes from "prop-types";

function Dish({ name, price, currency = "ETB", spicy = false, onAdd }) {
  const [count, setCount] = useState(0);

  function handleAdd() {
    setCount((c) => c + 1);
    onAdd(price);
  }

  return (
    <div className="dish">
      <h3>
        {name} {spicy && <span className="badge">🌶 Spicy</span>}
      </h3>
      <p>
        {price} {currency}
      </p>
      <div className="dish-actions">
        <button onClick={handleAdd}>Add</button>
        {count > 0 && <span className="count">x{count}</span>}
      </div>
    </div>
  );
}

Dish.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  currency: PropTypes.string,
  spicy: PropTypes.bool,
  onAdd: PropTypes.func.isRequired,
};

export default Dish;