export const orders = [];

export function addOrder(order) {
  const newOrder = { id: `order-${Date.now()}`, ...order };
  orders.push(newOrder);
  return newOrder;
}