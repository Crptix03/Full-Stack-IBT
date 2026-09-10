import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <header>
        <div className="brand serif">
          Royale <span>Bistro</span>
        </div>

        <nav>
          <a href="#">Home</a>
          <a href="#">Our Story</a>
          <a href="#" className="active">Menu</a>
          <a href="#">Contact</a>
        </nav>

        <div className="header-actions">
          <div className="cart-pill">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
              <path d="M3 3h2l2.4 12.2a2 2 0 002 1.8h8.2a2 2 0 002-1.7L21 8H6" />
              <circle cx="9.5" cy="20.5" r="1" />
              <circle cx="17.5" cy="20.5" r="1" />
            </svg>
            <span>0</span>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <Footer />

      <nav className="bottom-tab-bar">
        <a href="#" className="tab active">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6"><path d="M3 11l9-8 9 8M5 10v10h14V10" /></svg>
          <span>Home</span>
        </a>
        <a href="#" className="tab">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6"><path d="M4 19h16M4 5h16M4 12h16" /></svg>
          <span>Menu</span>
        </a>
        <a href="#" className="tab">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6"><path d="M3 3h2l2.4 12.2a2 2 0 002 1.8h8.2a2 2 0 002-1.7L21 8H6" /><circle cx="9.5" cy="20.5" r="1" /><circle cx="17.5" cy="20.5" r="1" /></svg>
          <span>Cart</span>
        </a>
        <a href="#" className="tab">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6"><path d="M4 21v-1a6 6 0 0112 0v1M10 11a4 4 0 100-8 4 4 0 000 8z" /></svg>
          <span>Contact</span>
        </a>
      </nav>
    </div>
  );
}