import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useThemeStore } from "../stores/useThemeStore";

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: "📊", end: true },
  { to: "/admin/dishes", label: "Menu", icon: "🍽️" },
  { to: "/admin/orders", label: "Orders", icon: "🚚" },
  { to: "/admin/reviews", label: "Reviews", icon: "⭐" },
  { to: "/admin/users", label: "Users", icon: "👥" },
];

export default function AdminLayout() {
  const signOut = useAuthStore((s) => s.signOut);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate("/signin");
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand serif">
          Royale <span>Admin</span>
        </div>

        <NavLink to="/" className="admin-back-link">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Site
        </NavLink>

        <nav className="admin-nav">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span>{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          🚪 Sign Out
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <h1 className="serif">Admin Panel</h1>
          <div className="admin-topbar-actions">
            <button
              className="admin-theme-btn"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              title="Toggle Theme"
            >
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

            <NavLink to="/" className="admin-view-store">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              View Store
            </NavLink>
          </div>
        </header>
        <Outlet />
      </main>

      <nav className="bottom-tab-bar admin-bottom-tab-bar">
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => `tab${isActive ? " active" : ""}`}
          >
            <span>{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}