import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCartStore, selectCartTotal } from "../stores/useCartStore";
import { useOrderStore } from "../stores/useOrderStore";
import { useAuthStore } from "../stores/useAuthStore";

export default function Checkout() {
  const items = useCartStore((s) => s.items);
  const cartTotal = useCartStore(selectCartTotal);
  const clearCart = useCartStore((s) => s.clearCart);

  const placeOrder = useOrderStore((s) => s.placeOrder);

  const currentUser = useAuthStore((s) => s.currentUser);
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState("delivery");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});

  //  Read from profile (guaranteed non-empty after our SignUp validation,
  // but still guard against legacy accounts with blank profiles)
  const name = currentUser?.fullName?.trim() || "";
  const phone = currentUser?.phone?.trim() || "";
  const profileIncomplete = !name || !phone;

  const deliveryFee = orderType === "delivery" ? 100 : 0;
  const total = cartTotal + deliveryFee;

  // Empty cart guard
  if (items.length === 0) {
    return (
      <section className="placeholder-page">
        <div className="title-band">
          <h1 className="serif">
            Check<em>out</em>
          </h1>
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

  //  Only validate the address — name and phone come from the profile
  const validate = () => {
    const newErrors = {};

    if (profileIncomplete) {
      newErrors.profile =
        "Your profile is missing required details. Please update it first.";
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

    const orderPayload = {
      items,
      subtotal: cartTotal,
      total,
      delivery: {
        type: orderType,
        name,
        phone,
        address: orderType === "delivery" ? address.trim() : null,
        deliveryFee,
      },
      customerUsername: currentUser?.username || "Guest",
    };

    const newOrder = placeOrder(orderPayload);

    clearCart();
    navigate("/order-confirmation", {
      state: { order: newOrder },
    });
  };

  return (
    <section className="checkout-page">
      <div className="title-band">
        <h1 className="serif">
          Check<em>out</em>
        </h1>
        <div className="rule" />
      </div>

      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          {/* Order type toggle */}
          <div className="order-type-toggle">
            <button
              type="button"
              className={orderType === "delivery" ? "active" : ""}
              onClick={() => setOrderType("delivery")}
            >
              Delivery
            </button>
            <button
              type="button"
              className={orderType === "pickup" ? "active" : ""}
              onClick={() => setOrderType("pickup")}
            >
              Pickup
            </button>
          </div>

          {/* Profile incomplete banner (only for legacy accounts) */}
          {profileIncomplete && (
            <div className="profile-incomplete-notice">
              <p>
                Your profile is missing a {!name ? "name" : "phone number"}.{" "}
                <Link to="/profile">Update your profile</Link> to continue.
              </p>
            </div>
          )}

          {/* Name — read-only from profile */}
          <div className="field">
            <label>Your Name</label>
            <div className="field-static-readonly">
              {name || "Not set"}
            </div>
          </div>

          {/* Phone — read-only from profile */}
          <div className="field">
            <label>Phone Number</label>
            <div className="field-static-readonly">
              {phone || "Not set"}
            </div>
          </div>

          {/* Delivery address — editable */}
          {orderType === "delivery" && (
            <div className="field">
              <label>Delivery Address *</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, area, city"
              />
              {errors.address && (
                <span className="field-error">{errors.address}</span>
              )}
            </div>
          )}

          {errors.profile && (
            <span className="field-error">{errors.profile}</span>
          )}

          {/* Estimated time */}
          <div className="delivery-estimate">
            {orderType === "delivery" ? (
              <span>
                Estimated delivery: <strong>30–45 min</strong>
              </span>
            ) : (
              <span>
                Estimated pickup ready: <strong>15–20 min</strong>
              </span>
            )}
          </div>

          <button
            type="submit"
            className="cart-place-order"
            disabled={profileIncomplete}
          >
            Place Order
          </button>
        </form>

        {/* Order summary sidebar */}
        <div className="checkout-summary">
          <h3 className="serif">Order Summary</h3>
          <div className="checkout-summary-items">
            {items.map((item) => (
              <div className="checkout-summary-row" key={item.id}>
                <span>
                  {item.qty}× {item.name}
                </span>
                <span>
                  {item.price * item.qty} <sup>Birr</sup>
                </span>
              </div>
            ))}
          </div>
          <div className="checkout-summary-row subtotal">
            <span>Subtotal</span>
            <span>
              {cartTotal} <sup>Birr</sup>
            </span>
          </div>
          <div className="checkout-summary-row">
            <span>Delivery Fee</span>
            <span>
              {deliveryFee} <sup>Birr</sup>
            </span>
          </div>
          <div className="checkout-summary-row total">
            <span>Total</span>
            <span className="serif">
              {total} <sup>Birr</sup>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}