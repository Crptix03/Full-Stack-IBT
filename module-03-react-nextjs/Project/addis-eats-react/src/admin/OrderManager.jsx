import { useState } from "react";
import { useOrderStore } from "../stores/useOrderStore";

const STATUSES = ["pending", "preparing", "on-the-way", "delivered", "cancelled"];

export default function OrderManager() {
  const orders = useOrderStore((s) => s.orders);
  const updateStatus = useOrderStore((s) => s.updateStatus);
  const deleteOrder = useOrderStore((s) => s.deleteOrder);
  const [search, setSearch] = useState("");

  const filtered = orders.filter((o) =>
    (o.id + (o.delivery?.name || "") + (o.customerUsername || ""))
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section>
      <header className="admin-page-head">
        <h1 className="serif">Order Tracking</h1>
        <p>Monitor and update live order statuses — customers see changes instantly</p>
      </header>

      <input
        className="admin-search"
        placeholder="Search by order ID, customer name, or account..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="admin-order-list">
        {filtered.length === 0 && <p className="empty-text">No orders found.</p>}
        {filtered.map((o) => (
          <div className="admin-order-card" key={o.id}>
            <div className="admin-order-head">
              <strong>#{o.id.slice(-6)}</strong>
              <span>{new Date(o.placedAt).toLocaleString()}</span>
              <span className="serif">{o.total} Birr</span>
            </div>

            <div className="admin-order-body">
              <div>
                <strong>{o.delivery?.name || "Guest"}</strong>
                <p>{o.delivery?.phone}</p>
                <p>{o.delivery?.address || "Pickup"}</p>
                {o.customerUsername && (
                  <p className="muted">
                    Account: <strong>{o.customerUsername}</strong>
                  </p>
                )}
              </div>

              <ul className="order-items-mini">
                {o.items.map((i) => (
                  <li key={i.id}>
                    {i.qty}× {i.name}
                  </li>
                ))}
              </ul>

              <div className="status-stack">
                <span className={`status-pill status-${o.status}`}>
                  {o.status.replace(/-/g, " ")}
                </span>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  className="admin-status-select"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  className="admin-delete-order"
                  onClick={() => {
                    if (confirm("Delete this order?")) deleteOrder(o.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}