// In-memory orders store.
// ⚠️ DEMO ONLY — resets on every server restart.
//
// We attach to globalThis so that server actions, pages, AND API routes
// all share the same array. Without this, Next.js dev mode can create
// separate module instances with separate copies of `orders`.

if (!globalThis.__orders) {
  globalThis.__orders = [];
}

export const orders = globalThis.__orders;

export function addOrder(order) {
  const newOrder = {
    id: `order-${Date.now()}`,
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
  return order;
}