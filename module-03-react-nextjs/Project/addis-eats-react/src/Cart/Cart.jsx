import { Link, useNavigate } from "react-router-dom";
import { useCartStore, selectCartTotal } from "../stores/useCartStore";

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const updateQty = useCartStore((s) => s.updateQty);
  const cartTotal = useCartStore(selectCartTotal);
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <section className="placeholder-page">
        <div className="title-band">
          <h1 className="serif">
            Your <em>Cart</em>
          </h1>
          <div className="rule" />
          <p className="placeholder-message">
            Your cart is currently empty. Explore our{" "}
            <Link to="/menu" style={{ color: "var(--color-primary)" }}>
              menu
            </Link>{" "}
            to add dishes.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="title-band">
        <h1 className="serif">
          Your <em>Cart</em>
        </h1>
        <div className="rule" />
      </div>

      <div className="cart-list">
        {items.map((item) => (
          <div className="cart-item" key={item.id}>
            <div className="cart-item-img">
              <img src={`/${item.img}`} alt={item.name} />
            </div>
            <div className="cart-item-body">
              <div className="cart-item-name serif">{item.name}</div>
              <div className="cart-item-price serif">
                {item.price} <sup>Birr</sup>
              </div>
            </div>
            <div className="qty-stepper">
              <button onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Decrease quantity">
                −
              </button>
              <span>{item.qty}</span>
              <button onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Increase quantity">
                +
              </button>
            </div>
            <button
              className="cart-remove"
              onClick={() => removeFromCart(item.id)}
              aria-label="Remove item"
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span className="serif">
            {cartTotal} <sup>Birr</sup>
          </span>
        </div>
        <button className="cart-place-order" onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </button>
      </div>
    </section>
  );
}