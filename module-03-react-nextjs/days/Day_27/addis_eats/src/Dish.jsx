import PropTypes from "prop-types";

function Dish({ name, price, currency = "ETB", spicy = false }) {
  return (
    <div className="dish">
      <h3>{name} {spicy && <span className="badge">🌶 Spicy</span>}</h3>
      <p>{price} {currency}</p>
    </div>
  );
}

Dish.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  spicy: PropTypes.bool,
};

export default Dish;