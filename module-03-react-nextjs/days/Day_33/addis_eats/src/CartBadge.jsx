import { useCartStore, selectCount } from "./cart/cartStore";

function CartBadge() {
  const count = useCartStore(selectCount);
  return <div className="cart-badge">🛒 {count}</div>;
}

export default CartBadge;