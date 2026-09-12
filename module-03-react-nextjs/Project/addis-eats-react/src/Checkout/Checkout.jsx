import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { items, cartTotal, placeOrder } = useCart();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState("delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});

  const deliveryFee = orderType === "delivery" ? 100 : 0;
  const total = cartTotal + deliveryFee;

  if (items.length === 0) {
    return (
      <section className="placeholder-page">
        <div className="title-band">
          <h1 className="serif">Check<em>out</em></h1>
          <div className="rule" />
          <p className="placeholder-message">
            Your cart is empty.{" "}
            <Link to="/menu" style={{ color: "var(--color-primary)" }}>
              Browse the menu
            </Link>{" "}
            first.
          </p>
        </div>
      </section>
    );
  }

    const validate = () => {
        const newErrors = {};

        const trimmedName = name.trim();
        if (!trimmedName) {
            newErrors.name = "Name is required";
        } else if (trimmedName.length < 2) {
            newErrors.name = "Name must be at least 2 characters long";
        } else if (!/^[a-zA-Za-zA-Z\s\u00C0-\u024F\u1200-\u137F'-]+$/.test(trimmedName)) {
            newErrors.name = "Please enter a valid name";
        }

        const cleanedPhone = phone.trim().replace(/[\s-]/g, "");
        if (!cleanedPhone) {
            newErrors.phone = "Phone number is required";
        } else if (!/^(?:\+251|0)[79]\d{8}$/.test(cleanedPhone)) {
            newErrors.phone = "Enter a valid Ethiopian number (e.g. 0901020304 or +251901020304)";
        }

        if (orderType === "delivery") {
            if (!address.trim()) {
            newErrors.address = "Delivery address is required";
            } else if (!/[a-zA-Z]/.test(address)) {
            newErrors.address = "Please enter a real address, not just numbers";
            }
        }

        return newErrors;
    };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    placeOrder({
      type: orderType,
      name: name.trim(),
      phone: phone.trim(),
      address: orderType === "delivery" ? address.trim() : null,
      deliveryFee,
      total,
    });

    navigate("/order-history");
  };

  return (
    <section className="checkout-page">
      <div className="title-band">
        <h1 className="serif">Check<em>out</em></h1>
        <div className="rule" />
      </div>

      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <div className="order-type-toggle">
            <button type="button" className={orderType === "delivery" ? "active" : ""} onClick={() => setOrderType("delivery")}>
              Delivery
            </button>
            <button type="button" className={orderType === "pickup" ? "active" : ""} onClick={() => setOrderType("pickup")}>
              Pickup
            </button>
          </div>

          <div className="field">
            <label>Your Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Your Name" />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="field">
            <label>Phone Number *</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+251 9xx xxx xxx" />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          {orderType === "delivery" && (
            <div className="field">
              <label>Delivery Address *</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, area, city" />
              {errors.address && <span className="field-error">{errors.address}</span>}
            </div>
          )}

          <div className="delivery-estimate">
            {orderType === "delivery" ? (
              <span>Estimated delivery: <strong>30–45 min</strong></span>
            ) : (
              <span>Estimated pickup ready: <strong>15–20 min</strong></span>
            )}
          </div>

          <button type="submit" className="cart-place-order">
            Place Order
          </button>
        </form>

        <div className="checkout-summary">
          <h3 className="serif">Order Summary</h3>
          <div className="checkout-summary-items">
            {items.map((item) => (
              <div className="checkout-summary-row" key={item.id}>
                <span>{item.qty}× {item.name}</span>
                <span>{item.price * item.qty} <sup>Birr</sup></span>
              </div>
            ))}
          </div>
          <div className="checkout-summary-row subtotal">
            <span>Subtotal</span>
            <span>{cartTotal} <sup>Birr</sup></span>
          </div>
          <div className="checkout-summary-row">
            <span>Delivery Fee</span>
            <span>{deliveryFee} <sup>Birr</sup></span>
          </div>
          <div className="checkout-summary-row total">
            <span>Total</span>
            <span className="serif">{total} <sup>Birr</sup></span>
          </div>
        </div>
      </div>
    </section>
  );
}