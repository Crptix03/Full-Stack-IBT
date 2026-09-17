import { useState } from "react";
import { useMenuStore } from "../stores/useMenuStore";
import DishForm from "./DishForm";

export default function DishManager() {
  const dishes = useMenuStore((s) => s.dishes);
  const categories = useMenuStore((s) => s.categories);
  const updateDish = useMenuStore((s) => s.updateDish);
  const removeDish = useMenuStore((s) => s.removeDish);
  const toggleAvailability = useMenuStore((s) => s.toggleAvailability);
  const addDish = useMenuStore((s) => s.addDish);

  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = dishes.filter((d) => {
    const catMatch = filter === "all" || d.category === filter;
    const textMatch = d.name.toLowerCase().includes(search.toLowerCase());
    return catMatch && textMatch;
  });

  const handleSave = (data) => {
    if (editing.id) {
      updateDish(editing.id, data);
    } else {
      addDish(data);
    }
    setEditing(null);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this dish?")) removeDish(id);
  };

  return (
    <section className="admin-menu">
      <header className="admin-page-head">
        <div>
          <h1 className="serif">Menu Management</h1>
          <p>Add, edit, or toggle availability of your dishes</p>
        </div>
        <button className="btn-filled" onClick={() => setEditing({})}>
          + Add Dish
        </button>
      </header>

      <div className="admin-filters">
        <input
          type="text"
          placeholder="Search dishes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-dish-grid">
        {filtered.map((d) => (
          <div className={`admin-dish-card ${d.isHidden ? "hidden" : ""}`} key={d.id}>
            <img src={`/${d.img}`} alt={d.name} />
            <div className="admin-dish-info">
              <strong>{d.name}</strong>
              <span>{d.price} Birr · {d.category}</span>
              {d.stock !== undefined && (
                <span className={`stock-pill ${d.stock < 10 ? "low" : ""}`}>
                  Stock: {d.stock}
                </span>
              )}
            </div>
            <div className="admin-dish-actions">
              <button onClick={() => toggleAvailability(d.id)}>
                {d.isHidden ? "Show" : "Hide"}
              </button>
              <button onClick={() => setEditing(d)}>Edit</button>
              <button className="danger" onClick={() => handleDelete(d.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing !== null && (
        <DishForm
          initial={editing}
          categories={categories}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </section>
  );
}