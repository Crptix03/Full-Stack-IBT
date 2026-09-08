import { Link } from "react-router-dom";
import { useCartStore, selectTotal } from "./cart/cartStore";

function CartPage() {
  const items = useCartStore((state) => state.items);
  const total = useCartStore(selectTotal);
  const remove = useCartStore((state) => state.remove);
  const clear = useCartStore((state) => state.clear);

  if (items.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div className="checkout-panel">
      <h2>Your order</h2>
      <ul>
        {items.map(i => (
          <li key={i.id}>
            {i.name} x{i.qty} — {i.price * i.qty} ETB
            <button onClick={() => remove(i.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: <strong>{total} ETB</strong></p>
      <button onClick={clear}>Clear cart</button>
      <Link to="/checkout" className="proceed-link">Proceed to checkout →</Link>
    </div>
  );
}

export default CartPage;