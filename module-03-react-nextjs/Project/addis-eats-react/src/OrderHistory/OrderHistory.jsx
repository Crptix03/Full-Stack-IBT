import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOrderStore } from "../stores/useOrderStore";
import { useAuthStore } from "../stores/useAuthStore";
import { useCartStore } from "../stores/useCartStore";
import { useReviewStore } from "../stores/useReviewStore";
import RatingModal from "../ui/RatingModal";
import StarRating from "../ui/StarRating";
import EmptyState from "../ui/EmptyState";

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
  const orders = useOrderStore((s) => s.orders);
  const currentUser = useAuthStore((s) => s.currentUser);
  const addToCart = useCartStore((s) => s.addToCart);
  const ratings = useReviewStore((s) => s.ratings);
  const navigate = useNavigate();

  // Local state for the currently open rating modal
  const [ratingDish, setRatingDish] = useState(null);

  // Only show the signed-in user's orders
  const myOrders = (orders || []).filter(
    (o) => o.customerUsername === currentUser?.username
  );

  // Helper — find the current user's rating for a dish
  const getUserRating = (dishId) =>
    ratings.find(
      (r) => r.dishId === dishId && r.username === currentUser?.username
    ) || null;

  // ── Reorder handler ─────────────────────────────────────
  const handleReorder = (order) => {
    order.items.forEach((item) => {
      for (let i = 0; i < item.qty; i++) {
        addToCart({
          id: item.id,
          name: item.name,
          price: item.price,
          img: item.img,
        });
      }
    });
    navigate("/cart");
  };

  // --- Empty states ---
  if (!currentUser) {
    return (
      <EmptyState
        icon="signin"
        title="Sign In to Track Orders"
        message="Please sign in to view your order history and track deliveries in real time."
        actionLabel="Sign In"
        actionTo="/signin"
      />
    );
  }

  if (myOrders.length === 0) {
    return (
      <EmptyState
        icon="orders"
        title="No Orders Yet"
        message="Once you place your first order, you'll be able to track it here in real time."
        actionLabel="Browse the Menu"
        actionTo="/menu"
      />
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
        {myOrders.map((order) => {
          // Cancelled orders can't be rated — the food was never made
          const canRate = order.status !== "cancelled";

          return (
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
                {order.items.map((item) => {
                  const userRating = getUserRating(item.id);

                  return (
                    <div className="order-item-row" key={item.id}>
                      <div className="order-item-left">
                        {item.img && (
                          <img
                            src={
                              item.img.startsWith("/")
                                ? item.img
                                : `/${item.img.replace(/^(Imgaes|Images|images)\//, "images/")}`
                            }
                            alt={item.name}
                            className="order-item-thumb"
                          />
                        )}
                        <div className="order-item-info">
                          <span>
                            {item.qty}× {item.name}
                          </span>

                          {/* Rating UI — only for non-cancelled orders */}
                          {canRate && (
                            <>
                              {userRating ? (
                                <div className="order-item-rating">
                                  <StarRating value={userRating.stars} size={14} />
                                  <button
                                    type="button"
                                    className="order-item-rate-btn ghost"
                                    onClick={() => setRatingDish(item)}
                                  >
                                    Edit
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  className="order-item-rate-btn"
                                  onClick={() => setRatingDish(item)}
                                >
                                  ★ Rate this dish
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <span>
                        {item.price * item.qty} <sup>Birr</sup>
                      </span>
                    </div>
                  );
                })}
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
                  {order.delivery.notes && (
                    <span className="order-notes-inline">
                      📝 {order.delivery.notes}
                    </span>
                  )}
                </div>
              )}

              <div className="order-footer">
                <span className="order-total serif">
                  Total: {order.total} <sup>Birr</sup>
                </span>

                <button
                  type="button"
                  className="btn-outline reorder-btn"
                  onClick={() => handleReorder(order)}
                >
                  ↺ Reorder
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="offers-footer">
        <Link to="/menu" className="btn-outline">
          Order Again
        </Link>
      </div>

      {/* Rating modal — renders only when a dish is being rated */}
      {ratingDish && (
        <RatingModal
          dish={ratingDish}
          username={currentUser.username}
          onClose={() => setRatingDish(null)}
        />
      )}
    </section>
  );
}