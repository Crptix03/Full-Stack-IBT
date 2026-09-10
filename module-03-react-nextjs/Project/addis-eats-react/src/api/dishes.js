const BASE_URL = "/menu-data.json";

export async function getDishes() {
  const res = await fetch(BASE_URL);

  if (!res.ok) {
    throw new Error(`Failed to load menu data: ${res.status}`);
  }

  return res.json();
}