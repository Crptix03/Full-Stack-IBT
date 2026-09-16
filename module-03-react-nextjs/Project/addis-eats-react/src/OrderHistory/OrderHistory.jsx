import { Link, useNavigate } from "react-router-dom";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const STEPS = [
  { key: "pending", label: "Placed", icon: "✓" },
  { key: "preparing", label: "Kitchen", icon: "🍳" },
  { key: "on-the-way", label: "On Way", icon: "🛵" },
  { key: "delivered", label: "Arrived", icon: "🏠" },
];

function StatusTimeline({ currentStatus }) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStatus);

  return (
    <div className="status-timeline">
      {STEPS.map((step, i) => {
        const state =
          i < currentIndex ? "done" : i === currentIndex ? "active" : "upcoming";
        return (
          <div className={`timeline-step ${state}`} key={step.key}>
            <div className="timeline-icon">{step.icon}</div>
            <span className="timeline-label">{step.label}</span>
            {i < STEPS.length - 1 && <div className="timeline-line" />}
          </div>
        );
      })}
    </div>
  );
}

export default function OrderHistory() {
  const { orders } = useOrders();
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  //  Only show the signed-in user's orders
  const myOrders = (orders || []).filter(
    (o) => o.customerUsername === currentUser?.username
  );

  // ── Reorder handler ─────────────────────────────────────
  const handleReorder = (order) => {
    order.items.forEach((item) => {
      // Add to cart with the same qty
      for (let i = 0; i < item.qty; i++) {
        addToCart({
          id: item.id,
          name: item.name,
          price: item.price,
          img: item.img, // may be undefined on older orders, but won't break
        });
      }
    });
    navigate("/cart");
  };

  // --- Empty states ---
  if (!currentUser) {
    return (
      <section className="placeholder-page">
        <div className="title-band">
          <h1 className="serif">
            Order <em>Tracking</em>
          </h1>
          <div className="rule" />
          <p className="placeholder-message">
            Please{" "}
            <Link to="/signin" style={{ color: "var(--color-primary)" }}>
              sign in
            </Link>{" "}
            to see your order history.
          </p>
        </div>
      </section>
    );
  }

  if (myOrders.length === 0) {
    return (
      <section className="placeholder-page">
        <div className="title-band">
          <h1 className="serif">
            Order <em>Tracking</em>
          </h1>
          <div className="rule" />
          <p className="placeholder-message">
            No orders yet. Once you place an order, you can track it here in real-time.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="order-history-page">
      <div className="title-band">
        <h1 className="serif">
          Order <em>Tracking</em>
        </h1>
        <div className="rule" />
      </div>

      <div className="order-history-list">
        {myOrders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-card-header">
              <div>
                <span className="order-id serif">#{order.id.slice(-6)}</span>
                <span className="order-date">
                  {new Date(order.placedAt).toLocaleString()}
                </span>
              </div>
              <span className={`order-status-pill status-${order.status}`}>
                {order.status.replace(/-/g, " ")}
              </span>
            </div>

            <StatusTimeline currentStatus={order.status} />

            <div className="order-items">
              {order.items.map((item) => (
                <div className="order-item-row" key={item.id}>
                  <span>
                    {item.qty}× {item.name}
                  </span>
                  <span>
                    {item.price * item.qty} <sup>Birr</sup>
                  </span>
                </div>
              ))}
            </div>

            {order.delivery && (
              <div className="order-delivery-info">
                <span>
                  {order.delivery.type === "delivery" ? "🚚 Delivery" : "🏬 Pickup"}
                </span>
                <span>
                  {order.delivery.name} · {order.delivery.phone}
                </span>
                {order.delivery.address && <span>{order.delivery.address}</span>}
              </div>
            )}

            <div className="order-footer">
              <span className="order-total serif">
                Total: {order.total} <sup>Birr</sup>
              </span>

              {/*  Reorder button */}
              <button
                type="button"
                className="btn-outline reorder-btn"
                onClick={() => handleReorder(order)}
              >
                ↺ Reorder
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="offers-footer">
        <Link to="/menu" className="btn-outline">
          Order Again
        </Link>
      </div>
    </section>
  );
}