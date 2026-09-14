import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  // If someone lands here without an order, redirect home
  useEffect(() => {
    if (!order) {
      navigate("/", { replace: true });
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <section className="confirmation-page">
      <div className="confirmation-card">
        <div className="confirmation-icon">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h1 className="serif">
          Thank <em>You!</em>
        </h1>
        <div className="rule" />

        <p className="confirmation-message">
          Your order has been placed successfully. We're preparing it with love.
        </p>

        <div className="confirmation-details">
          <div className="confirmation-row">
            <span>Order ID</span>
            <strong className="serif">#{order.id.slice(-6)}</strong>
          </div>
          <div className="confirmation-row">
            <span>Total</span>
            <strong className="serif">
              {order.total} <sup>Birr</sup>
            </strong>
          </div>
          <div className="confirmation-row">
            <span>Type</span>
            <strong>
              {order.delivery?.type === "delivery" ? "🚚 Delivery" : "🏬 Pickup"}
            </strong>
          </div>
          {order.delivery?.address && (
            <div className="confirmation-row">
              <span>Address</span>
              <strong>{order.delivery.address}</strong>
            </div>
          )}
          <div className="confirmation-row">
            <span>Estimated time</span>
            <strong>
              {order.delivery?.type === "delivery" ? "30–45 min" : "15–20 min"}
            </strong>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link to="/order-history" className="cart-place-order">
            Track My Order
          </Link>
          <Link to="/menu" className="btn-outline">
            Order More
          </Link>
        </div>
      </div>
    </section>
  );
}