export const dishes = [
  { id: "d1", name: "Crispy Sambusa", price: 100, category: "Starters" },
  { id: "d2", name: "Steak & Fries", price: 3000, category: "Mains" },
  { id: "d3", name: "Big Smokey Burger", price: 750, category: "Mains" },
  { id: "d4", name: "Honey Baklava", price: 250, category: "Desserts" },
];

export function findDish(id) {
  return dishes.find((d) => d.id === id) || null;
}