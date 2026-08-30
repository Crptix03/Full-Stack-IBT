import { useState } from "react";

function OrderForm() {
  const [form, setForm] = useState({ name: "", phone: "", area: "" });

  const phoneRegex = /^(?:\+251|0)(9\d{8}|7\d{8})$/;
  const isPhoneValid = phoneRegex.test(form.phone.trim());
  const isFormValid = form.name.trim() !== "" && isPhoneValid && form.area.trim() !== "";

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid) return;
    alert(`Order placed for ${form.name}, delivering to ${form.area}. We'll call ${form.phone}.`);
    setForm({ name: "", phone: "", area: "" });
  }

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <h2>Delivery details</h2>

      <label>
        Name
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" />
      </label>

      <label>
        TeleBirr number
        <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="09XXXXXXXX" />
        {form.phone && !isPhoneValid && (
          <span className="field-error">Enter a valid TeleBirr number (e.g. 0912345678)</span>
        )}
      </label>

      <label>
        Delivery area
        <input type="text" name="area" value={form.area} onChange={handleChange} placeholder="e.g. Bole, Addis Ababa" />
      </label>

      <button type="submit" disabled={!isFormValid}>
        Place order
      </button>
    </form>
  );
}

export default OrderForm;