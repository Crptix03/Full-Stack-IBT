import { Outlet, NavLink } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "./cart/CartProvider";

function Layout() {
  const { items } = useContext(CartContext);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div>
      <header className="app-header">
        <h1>Addis Eats</h1>
        <nav className="main-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Menu
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => (isActive ? "active" : "")}>
            Cart
          </NavLink>
          <NavLink to="/checkout" className={({ isActive }) => (isActive ? "active" : "")}>
            Checkout
          </NavLink>
        </nav>
        <div className="cart-badge">🛒 {count}</div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>Addis Eats — delivering across Addis Ababa.</p>
      </footer>
    </div>
  );
}

export default Layout;