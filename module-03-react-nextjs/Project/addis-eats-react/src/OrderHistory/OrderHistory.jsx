import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function OrderHistory() {
  const { orderHistory } = useCart();

  if (orderHistory.length === 0) {
    return (
      <section className="placeholder-page">
        <div className="title-band">
          <h1 className="serif">
            Order <em>History</em>
          </h1>
          <div className="rule" />
          <p className="placeholder-message">
            No past orders found. Once you place an order, it'll show up here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="order-history-page">
      <div className="title-band">
        <h1 className="serif">
          Order <em>History</em>
        </h1>
        <div className="rule" />
      </div>

      <div className="order-history-list">
        {orderHistory.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-card-header">
              <span className="order-date">
                {new Date(order.placedAt).toLocaleString()}
              </span>
              <span className="order-total serif">
                {order.total} <sup>Birr</sup>
              </span>
            </div>
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
              {order.delivery && (
                <div className="order-delivery-info">
                  <span>{order.delivery.type === "delivery" ? "🚚 Delivery" : "🏬 Pickup"}</span>
                  <span>{order.delivery.name} · {order.delivery.phone}</span>
                  {order.delivery.address && <span>{order.delivery.address}</span>}
                </div>
              )}
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