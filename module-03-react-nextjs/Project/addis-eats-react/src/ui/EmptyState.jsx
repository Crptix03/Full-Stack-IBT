import { Link } from "react-router-dom";

export default function EmptyState({
  icon = "bag",
  title = "Nothing here yet",
  message,
  actionLabel,
  actionTo,
}) {
  return (
    <section className="empty-state">
      <div className="empty-state-icon">
        {icon === "cart" && (
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3h2l2.4 12.2a2 2 0 002 1.8h8.2a2 2 0 002-1.7L21 8H6" />
            <circle cx="9.5" cy="20.5" r="1.5" />
            <circle cx="17.5" cy="20.5" r="1.5" />
          </svg>
        )}
        {icon === "orders" && (
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        )}
        {icon === "signin" && (
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" />
          </svg>
        )}
      </div>

      <h1 className="serif empty-state-title">{title}</h1>
      <div className="rule" />

      {message && <p className="empty-state-message">{message}</p>}

      {actionLabel && actionTo && (
        <Link to={actionTo} className="empty-state-action">
          {actionLabel}
        </Link>
      )}
    </section>
  );
}