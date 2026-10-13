// In-memory orders store.
// DEMO ONLY — resets on every server restart.
//
// We attach to globalThis so that server actions, pages, AND API routes
// all share the same array. Without this, Next.js dev mode can create
// separate module instances with separate copies of `orders`.

if (!globalThis.__orders) {
  globalThis.__orders = [];
}

export const orders = globalThis.__orders;

const AREAS = [
  "Bole",
  "Kazanchis",
  "Megenagna",
  "Piassa",
  "CMC",
  "Gerji",
  "Summit",
  "Ayat",
  "Saris",
  "Lafto",
  "Old Airport",
  "Wollo Sefer",
  "Mekanisa",
  "Kera",
  "Bulbula",
];

// Parse a neighbourhood out of the freeform address string.
// Matches against a known list of Addis areas; falls back to "Other".
export function getNeighbourhood(address) {
  if (!address) return "Other";
  const lower = address.toLowerCase();
  for (const area of AREAS) {
    if (lower.includes(area.toLowerCase())) return area;
  }
  return "Other";
}

export function addOrder(order) {
  const newOrder = {
    id: `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    ...order,
  };
  orders.push(newOrder);
  return newOrder;
}

// Scoped query: only returns orders belonging to the given user.
export function getOrdersFor(userId) {
  return orders
    .filter((o) => o.customerId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Get a single order by id (still must be checked against session in the page).
export function getOrderById(id) {
  return orders.find((o) => o.id === id) || null;
}

// Staff-only: all orders.
export function getAllOrders() {
  return [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

export function updateOrderStatus(id, status) {
  const order = orders.find((o) => o.id === id);
  if (!order) return null;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  return order;
}

// ── Dashboard aggregations ──────────────────────────────
// Revenue per neighbourhood: only counts orders that are not cancelled.
export function getRevenueByArea() {
  const map = new Map();
  for (const order of orders) {
    if (order.status === "cancelled") continue;
    const area = getNeighbourhood(order.address);
    map.set(area, (map.get(area) || 0) + (order.total || 0));
  }
  const rows = Array.from(map.entries()).map(([area, revenue]) => ({
    area,
    revenue,
  }));
  return rows.sort((a, b) => b.revenue - a.revenue);
}

// Orders per day for the last N days. Includes days with zero orders.
export function getOrdersPerDay(days = 14) {
  const result = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const next = new Date(day);
    next.setDate(day.getDate() + 1);

    const count = orders.filter((o) => {
      const d = new Date(o.createdAt);
      return d >= day && d < next;
    }).length;

    result.push({
      date: day.toISOString().slice(0, 10),
      label: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      orders: count,
    });
  }
  return result;
}

// ── Demo seeding (staff only) ───────────────────────────
// Remove only the seeded demo orders. Real user-placed orders stay.
// Seeded orders have IDs starting with "order-seed-".
export function clearSeedOrders() {
  const before = orders.length;
  const kept = orders.filter((o) => !o.id.startsWith("order-seed-"));
  orders.length = 0;
  orders.push(...kept);
  return before - kept.length;
}

// Adds 12 realistic orders spread across the last 12 days.
// Idempotent — calling it twice does not double the seed.
export function seedDemoOrders() {
  // If seed data already exists, remove it first so we don't duplicate.
  const alreadySeeded = orders.some((o) => o.id.startsWith("order-seed-"));
  if (alreadySeeded) {
    clearSeedOrders();
  }

  const customers = [
    { id: "u-abebe", name: "Abebe", phone: "+251911223344" },
    { id: "u-bekele", name: "Bekele", phone: "+251911556677" },
    { id: "u-sara", name: "Sara", phone: "+251911998877" },
  ];

  const areaAddresses = [
    "Bole, near Edna Mall",
    "Kazanchis, behind the UN",
    "Megenagna, opposite the roundabout",
    "CMC, next to the mosque",
    "Piassa, near Cinema Ethiopia",
    "Old Airport, near the golf course",
    "Saris, Addis Ababa",
  ];

  const sampleItems = [
    { id: "d1", name: "Crispy Sambusa", price: 100, qty: 2 },
    { id: "d2", name: "Steak & Fries", price: 3000, qty: 1 },
    { id: "d3", name: "Big Smokey Burger", price: 750, qty: 2 },
    { id: "d8", name: "Honey Baklava", price: 100, qty: 3 },
    { id: "d10", name: "Sprite", price: 70, qty: 2 },
  ];

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  for (let i = 0; i < 12; i++) {
    const customer = customers[i % customers.length];
    const address = areaAddresses[i % areaAddresses.length];
    const items = [
      sampleItems[i % sampleItems.length],
      sampleItems[(i + 1) % sampleItems.length],
    ];
    const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
    const daysAgo = Math.floor((i * 12) / 12);
    const createdAt = new Date(now - daysAgo * dayMs - i * 3600 * 1000);

    orders.push({
      id: `order-seed-${now}-${i}`,
      createdAt: createdAt.toISOString(),
      customerId: customer.id,
      customerName: customer.name,
      phone: customer.phone,
      address,
      items,
      total,
      status: i % 5 === 0 ? "delivered" : i % 3 === 0 ? "preparing" : "pending",
    });
  }

  return orders.length;
}