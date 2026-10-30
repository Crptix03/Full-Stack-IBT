// ⚠️ DEMO ONLY — resets on every server restart.

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

export function getOrdersFor(userId) {
  return orders
    .filter((o) => o.customerId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getOrderById(id) {
  return orders.find((o) => o.id === id) || null;
}

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