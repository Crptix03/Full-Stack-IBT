export async function loadDishes(category, signal) {
  const res = await fetch("/dishes.json", { signal });

  if (!res.ok) {
    throw new Error(`Failed to load menu (status ${res.status})`);
  }

  const data = await res.json();

  if (!category || category === "all") {
    return data;
  }

  return data.filter(d => d.category === category);
}