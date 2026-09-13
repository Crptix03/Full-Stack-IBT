import { NavLink, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useCart } from "./context/CartContext";
import { useTheme } from "./context/ThemeContext";
import AccountMenu from "./AccountMenu";

export default function Layout({ children }) {
  const { cartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="layout">
      <header>
        <NavLink to="/" className="brand serif" style={{ textDecoration: "none" }}>
          Royale <span>Bistro</span>
        </NavLink>

        <nav>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
          <NavLink to="/#story" className={({ isActive }) => (isActive ? "active" : "")}>
            Our Story
          </NavLink>
          <NavLink to="/menu" className={({ isActive }) => (isActive ? "active" : "")}>
            Menu
          </NavLink>
          <NavLink to="/order-history" className={({ isActive }) => (isActive ? "active" : "")}>
            Order History
          </NavLink>
        </nav>

        <div className="header-actions">
          <button
            className="icon-btn"
            aria-label="Search"
            onClick={() => navigate("/menu", { state: { focusSearch: true } })}
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          <button className="icon-btn" aria-label="Toggle Theme" onClick={toggleTheme}>
            {theme === "dark" ? (
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4.5" />
                <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
              </svg>
            )}
          </button>

          
          <AccountMenu />

          <NavLink to="/cart" className="cart-pill" style={{ textDecoration: "none" }}>
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
              <path d="M3 3h2l2.4 12.2a2 2 0 002 1.8h8.2a2 2 0 002-1.7L21 8H6" />
              <circle cx="9.5" cy="20.5" r="1" />
              <circle cx="17.5" cy="20.5" r="1" />
            </svg>
            <span>{cartCount}</span>
          </NavLink>
        </div>
      </header>

      <main>{children}</main>

      <Footer />

      <nav className="bottom-tab-bar">
        <NavLink to="/" end className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6"><path d="M3 11l9-8 9 8M5 10v10h14V10" /></svg>
          <span>Home</span>
        </NavLink>
        <NavLink to="/menu" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6"><path d="M4 19h16M4 5h16M4 12h16" /></svg>
          <span>Menu</span>
        </NavLink>
        <NavLink to="/cart" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6"><path d="M3 3h2l2.4 12.2a2 2 0 002 1.8h8.2a2 2 0 002-1.7L21 8H6" /><circle cx="9.5" cy="20.5" r="1" /><circle cx="17.5" cy="20.5" r="1" /></svg>
          <span>Cart{cartCount > 0 ? ` (${cartCount})` : ""}</span>
        </NavLink>
        <NavLink to="/order-history" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
          <span>History</span>
        </NavLink>
      </nav>
    </div>
  );
}