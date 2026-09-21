import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "./Footer";
import { useCartStore, selectCartCount } from "../stores/useCartStore";
import { useThemeStore } from "../stores/useThemeStore";
import AccountMenu from "./AccountMenu";
import ScrollToHash from "./ScrollToHash";

export default function Layout() {
  const cartCount = useCartStore(selectCartCount);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(null);

  const HEADER_OFFSET = 80;

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection(null);
      return;
    }

    const handleScroll = () => {
      const storyEl = document.getElementById("story");
      if (!storyEl) {
        setActiveSection(null);
        return;
      }

      const rect = storyEl.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const isVisible =
        rect.top < viewportHeight - 100 &&
        rect.bottom > HEADER_OFFSET + 100;

      setActiveSection(isVisible ? "story" : null);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  const handleStoryClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const el = document.getElementById("story");
      if (el) {
        const top =
          el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top, behavior: "smooth" });
      }
    } else {
      navigate("/#story");
    }
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  return (
    <div className="layout">
      <ScrollToHash />

      <header>
        <NavLink
          to="/"
          className="brand serif"
          style={{ textDecoration: "none" }}
          onClick={handleLogoClick}
        >
          Royale <span>Bistro</span>
        </NavLink>

        <nav>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
            onClick={handleHomeClick}
          >
            Home
          </NavLink>

          <a
            href="/#story"
            className={`nav-link ${activeSection === "story" ? "active" : ""}`}
            onClick={handleStoryClick}
          >
            Our Story
          </a>

          <NavLink
            to="/menu"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Menu
          </NavLink>

          <NavLink
            to="/order-history"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Order History
          </NavLink>
        </nav>

        <div className="header-actions">
          {/* ✅ Search button removed */}

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

      <main>
        <Outlet />
      </main>

      <Footer />

      <nav className="bottom-tab-bar">
        <NavLink to="/" end className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
            <path d="M3 11l9-8 9 8M5 10v10h14V10" />
          </svg>
          <span>Home</span>
        </NavLink>

        <NavLink to="/menu" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
            <path d="M4 19h16M4 5h16M4 12h16" />
          </svg>
          <span>Menu</span>
        </NavLink>

        <NavLink to="/cart" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
            <path d="M3 3h2l2.4 12.2a2 2 0 002 1.8h8.2a2 2 0 002-1.7L21 8H6" />
            <circle cx="9.5" cy="20.5" r="1" />
            <circle cx="17.5" cy="20.5" r="1" />
          </svg>
          <span>Cart{cartCount > 0 ? ` (${cartCount})` : ""}</span>
        </NavLink>

        <NavLink to="/order-history" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          <span>History</span>
        </NavLink>
      </nav>
    </div>
  );
}