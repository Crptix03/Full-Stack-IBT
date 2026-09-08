import { useContext } from "react";
import { CartContext } from "./cart/CartProvider";

function Header() {
  const { items } = useContext(CartContext);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <header className="app-header">
      <h1>Addis Eats</h1>
      <div className="cart-badge">🛒 {count}</div>
    </header>
  );
}

export default Header;