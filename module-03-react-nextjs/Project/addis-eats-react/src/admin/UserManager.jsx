import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function UserManager() {
  const { users, currentUser } = useAuth();
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      u.username.toLowerCase().includes(q) ||
      (u.fullName || "").toLowerCase().includes(q) ||
      (u.phone || "").includes(q)
    );
  });

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section>
      <header className="admin-page-head">
        <div>
          <h1 className="serif">User Accounts</h1>
          <p>{users.length} registered accounts</p>
        </div>
      </header>

      <input
        className="admin-search"
        placeholder="Search by username, name, or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="admin-user-list">
        {filtered.length === 0 && (
          <p className="empty-text">No users match your search.</p>
        )}

        {filtered.map((u) => {
          const isSelf = currentUser?.username === u.username;
          const initial = (u.username || "?")[0].toUpperCase();

          return (
            <div className="admin-user-card" key={u.username}>
              {/* Avatar / initial */}
              <div className="admin-user-avatar">
                {u.avatar ? (
                  <img src={u.avatar} alt={u.username} />
                ) : (
                  <span>{initial}</span>
                )}
              </div>

              {/* Info */}
              <div className="admin-user-info">
                <div className="admin-user-top">
                  <strong>{u.username}</strong>
                  {u.isAdmin && <span className="admin-badge-small">Admin</span>}
                  {isSelf && <span className="admin-badge-small self">You</span>}
                </div>
                <p className="admin-user-name">{u.fullName || "No name set"}</p>
                <p className="admin-user-phone">{u.phone || "No phone set"}</p>
                {u.createdAt && (
                  <p className="admin-user-joined">
                    Joined {formatDate(u.createdAt)}
                  </p>
                )}
              </div>

              {/* Actions — placeholder buttons */}
              <div className="admin-user-actions">
                <span className="admin-user-status">
                  {u.isAdmin ? "Administrator" : "Customer"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}