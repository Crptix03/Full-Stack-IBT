import { useContext } from "react";
import { CartContext } from "./cart/CartProvider";

function CheckoutPanel() {
  const { items, dispatch, total } = useContext(CartContext);

  if (items.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div className="checkout-panel">
      <h2>Your order</h2>
      <ul>
        {items.map(i => (
          <li key={i.id}>
            {i.name} x{i.qty} — {i.price * i.qty} ETB
            <button onClick={() => dispatch({ type: "REMOVE", id: i.id })}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: <strong>{total} ETB</strong></p>
      <button onClick={() => dispatch({ type: "CLEAR" })}>Clear cart</button>
    </div>
  );
}

export default CheckoutPanel;