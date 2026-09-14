import { useOrders } from "../context/OrderContext";
import { useMenu } from "../context/MenuContext";

export default function Dashboard() {
  const { orders } = useOrders();
  const { dishes } = useMenu();

  // Safeguard in case providers haven't loaded yet
  const orderList = orders || [];
  const dishList = dishes || [];

  const totalRevenue = orderList.reduce((sum, o) => sum + (o.total || 0), 0);
  const avgOrder = orderList.length
    ? Math.round(totalRevenue / orderList.length)
    : 0;
  const lowStock = dishList.filter(
    (d) => d.stock !== undefined && d.stock < 10
  ).length;

  return (
    <section className="admin-dashboard">
      <header className="admin-page-head">
        <h1 className="serif">Dashboard</h1>
        <p>Overview of your restaurant operations</p>
      </header>

      <div className="stat-grid">
        <div className="stat-card">
          <span>Total Revenue</span>
          <strong className="serif">
            {totalRevenue} <sup>Birr</sup>
          </strong>
        </div>
        <div className="stat-card">
          <span>Total Orders</span>
          <strong className="serif">{orderList.length}</strong>
        </div>
        <div className="stat-card">
          <span>Avg Order Value</span>
          <strong className="serif">
            {avgOrder} <sup>Birr</sup>
          </strong>
        </div>
        <div className="stat-card warning">
          <span>Low Stock Items</span>
          <strong className="serif">{lowStock}</strong>
        </div>
      </div>

      <div className="admin-panels">
        <div className="admin-panel">
          <h2 className="serif">Recent Orders</h2>
          {orderList.length === 0 ? (
            <p className="empty-text">No orders yet</p>
          ) : (
            orderList.slice(0, 5).map((o) => (
              <div className="mini-row" key={o.id}>
                <span>#{o.id.slice(-6)}</span>
                <span>{o.delivery?.name || "Guest"}</span>
                <span className="serif">{o.total} Birr</span>
              </div>
            ))
          )}
        </div>

        <div className="admin-panel">
          <h2 className="serif">Menu Snapshot</h2>
          <div className="mini-row">
            <span>Active dishes</span>
            <span>{dishList.filter((d) => !d.isHidden).length}</span>
          </div>
          <div className="mini-row">
            <span>Hidden dishes</span>
            <span>{dishList.filter((d) => d.isHidden).length}</span>
          </div>
          <div className="mini-row">
            <span>Total items</span>
            <span>{dishList.length}</span>
          </div>
        </div>
      </div>
    </section>
  );
}