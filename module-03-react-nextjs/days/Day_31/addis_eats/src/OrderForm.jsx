import { useReducer } from "react";

function formReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return { name: "", phone: "", area: "" };
    default:
      return state;
  }
}

function OrderForm() {
  const [form, dispatch] = useReducer(formReducer, { name: "", phone: "", area: "" });

  const phoneRegex = /^(?:\+251|0)(9\d{8}|7\d{8})$/;
  const isPhoneValid = phoneRegex.test(form.phone.trim());
  const isFormValid = form.name.trim() !== "" && isPhoneValid && form.area.trim() !== "";

  function handleChange(e) {
    dispatch({ type: "SET_FIELD", field: e.target.name, value: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid) return;
    alert(`Order placed for ${form.name}, delivering to ${form.area}. We'll call ${form.phone}.`);
    dispatch({ type: "RESET" });
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
        <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+251-9x-xxx-xxxx" />
        {form.phone && !isPhoneValid && (
          <span className="field-error">Enter a valid TeleBirr number (e.g. +251922114453)</span>
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