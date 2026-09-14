import { useState } from "react";

export default function DishForm({ initial, categories, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: initial.name || "",
    price: initial.price || "",
    category: initial.category || categories[0] || "mains",
    description: initial.description || "",
    img: initial.img || "",
    tag: initial.tag || "",
    stock: initial.stock ?? 20,
    isHidden: initial.isHidden ?? false,
  });

  const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;
    onSave({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    });
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <form
        className="admin-modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2 className="serif">{initial.id ? "Edit Dish" : "New Dish"}</h2>

        <label>
          Name
          <input
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </label>

        <label>
          Price (Birr)
          <input
            type="number"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            required
          />
        </label>

        <label>
          Category
          <select
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label>
          Description
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </label>

        <label>
          Image filename (e.g. sambusa.webp)
          <input
            value={form.img}
            onChange={(e) => handleChange("img", e.target.value)}
            placeholder="sambusa.webp"
          />
        </label>

        <label>
          Stock
          <input
            type="number"
            value={form.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
          />
        </label>

        <label>
          Tag (optional)
          <input
            value={form.tag}
            onChange={(e) => handleChange("tag", e.target.value)}
            placeholder="Veg, Popular, Spicy..."
          />
        </label>

        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-filled">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}