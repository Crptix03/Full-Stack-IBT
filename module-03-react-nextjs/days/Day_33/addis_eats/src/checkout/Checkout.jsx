import { useState, useRef } from "react";
import { validate, AREAS } from "./validate";
import { placeOrder } from "../api/orders";
import { useCartStore, selectTotal } from "../cart/cartStore";
import Field from "./Field";

const initialForm = { name: "", phone: "", area: "", notes: "" };
const initialTouched = { name: false, phone: false, area: false, notes: false };

function Checkout() {
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState(initialTouched);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [serverFieldErrors, setServerFieldErrors] = useState({});

  const total = useCartStore(selectTotal);
  const clear = useCartStore((state) => state.clear);

  const fieldRefs = {
    name: useRef(null),
    phone: useRef(null),
    area: useRef(null),
  };

  const clientErrors = validate(form);
  const errors = { ...clientErrors, ...serverFieldErrors };

  const isFormValid = Object.keys(clientErrors).length === 0;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (serverFieldErrors[name]) {
      setServerFieldErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }

  function focusFirstBadField(errorObj) {
    const order = ["name", "phone", "area"];
    const firstBad = order.find(f => errorObj[f]);
    if (firstBad && fieldRefs[firstBad]?.current) {
      fieldRefs[firstBad].current.focus();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setTouched({ name: true, phone: true, area: true, notes: true });

    if (!isFormValid) {
      focusFirstBadField(clientErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await placeOrder({ ...form, total });
      clear();
      setForm(initialForm);
      setTouched(initialTouched);
      setServerFieldErrors({});
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
      if (err.fieldErrors) {
        setServerFieldErrors(err.fieldErrors);
        focusFirstBadField(err.fieldErrors);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="checkout-form" onSubmit={handleSubmit} noValidate>
      <h2>Delivery details</h2>


      <Field
        name="name"
        label="Name"
        value={form.name}
        error={errors.name}
        touched={touched.name}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Your full name"
        inputRef={fieldRefs.name}
      />

      <Field
        name="phone"
        label="TeleBirr number"
        type="tel"
        value={form.phone}
        error={errors.phone}
        touched={touched.phone}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="0912345678"
        inputRef={fieldRefs.phone}
      />

      <Field
        name="area"
        label="Delivery area"
        as="select"
        options={AREAS}
        value={form.area}
        error={errors.area}
        touched={touched.area}
        onChange={handleChange}
        onBlur={handleBlur}
        inputRef={fieldRefs.area}
      />

      <Field
        name="notes"
        label="Notes (optional)"
        value={form.notes}
        error={errors.notes}
        touched={touched.notes}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Anything we should know?"
      />

      {submitError && (
        <p role="alert" className="submit-error">
          {submitError}
        </p>

      )}

      <button type="submit" disabled={submitting}>
        {submitting ? "Placing order..." : `Place order — ${total} ETB`}
      </button>

    </form>

  );
}

export default Checkout;