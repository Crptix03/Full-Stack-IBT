import { useMemo } from "react";
import { useOrderStore } from "../stores/useOrderStore";
import { useMenuStore } from "../stores/useMenuStore";

export default function Dashboard() {
  const orders = useOrderStore((s) => s.orders);
  const dishes = useMenuStore((s) => s.dishes);

  const orderList = orders || [];
  const dishList = dishes || [];

  const totalRevenue = orderList.reduce((sum, o) => sum + (o.total || 0), 0);
  const avgOrder = orderList.length
    ? Math.round(totalRevenue / orderList.length)
    : 0;

  const last7Days = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-US", { weekday: "short" });
      days.push({ key, label, revenue: 0, count: 0 });
    }
    orderList.forEach((o) => {
      const day = new Date(o.placedAt).toISOString().split("T")[0];
      const slot = days.find((d) => d.key === day);
      if (slot) {
        slot.revenue += o.total || 0;
        slot.count += 1;
      }
    });
    return days;
  }, [orderList]);

  const maxDailyRevenue = Math.max(...last7Days.map((d) => d.revenue), 1);

  const topDishes = useMemo(() => {
    const counts = {};
    orderList.forEach((o) => {
      (o.items || []).forEach((i) => {
        if (!counts[i.name]) counts[i.name] = { qty: 0, revenue: 0 };
        counts[i.name].qty += i.qty;
        counts[i.name].revenue += i.qty * i.price;
      });
    });
    return Object.entries(counts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [orderList]);

  const maxDishQty = Math.max(...topDishes.map((d) => d.qty), 1);

  const statusCounts = useMemo(() => {
    const counts = { pending: 0, preparing: 0, "on-the-way": 0, delivered: 0, cancelled: 0 };
    orderList.forEach((o) => {
      if (counts[o.status] !== undefined) counts[o.status] += 1;
    });
    return counts;
  }, [orderList]);

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
            {totalRevenue.toLocaleString()} <sup>Birr</sup>
          </strong>
        </div>
        <div className="stat-card">
          <span>Total Orders</span>
          <strong className="serif">{orderList.length}</strong>
        </div>
        <div className="stat-card">
          <span>Avg Order</span>
          <strong className="serif">
            {avgOrder.toLocaleString()} <sup>Birr</sup>
          </strong>
        </div>
        <div className="stat-card">
          <span>Menu Items</span>
          <strong className="serif">{dishList.length}</strong>
        </div>
      </div>

      <div className="admin-panel chart-panel">
        <div className="chart-head">
          <h2 className="serif">Revenue — Last 7 Days</h2>
          <span className="chart-total">
            {last7Days.reduce((s, d) => s + d.revenue, 0).toLocaleString()} Birr
          </span>
        </div>
        <div className="bar-chart">
          {last7Days.map((day) => {
            const heightPct = (day.revenue / maxDailyRevenue) * 100;
            return (
              <div className="bar-col" key={day.key}>
                <div className="bar-value">
                  {day.revenue > 0 ? day.revenue : ""}
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <div className="bar-label">{day.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="admin-panels">
        <div className="admin-panel">
          <h2 className="serif">Top Dishes</h2>
          {topDishes.length === 0 ? (
            <p className="empty-text">No data yet</p>
          ) : (
            <div className="hbar-list">
              {topDishes.map((d) => {
                const widthPct = (d.qty / maxDishQty) * 100;
                return (
                  <div className="hbar-row" key={d.name}>
                    <div className="hbar-meta">
                      <span className="hbar-name">{d.name}</span>
                      <span className="hbar-count">{d.qty} sold</span>
                    </div>
                    <div className="hbar-track">
                      <div
                        className="hbar-fill"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="admin-panel">
          <h2 className="serif">Order Status</h2>
          <div className="status-breakdown">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div className="status-row" key={status}>
                <span className={`status-pill status-${status}`}>
                  {status.replace(/-/g, " ")}
                </span>
                <strong className="serif">{count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-panel">
        <h2 className="serif">Recent Orders</h2>
        {orderList.length === 0 ? (
          <p className="empty-text">No orders yet</p>
        ) : (
          <div className="recent-orders-list">
            {orderList.slice(0, 6).map((o) => (
              <div className="mini-row" key={o.id}>
                <span>#{o.id.slice(-6)}</span>
                <span>{o.delivery?.name || "Guest"}</span>
                <span className={`status-pill status-${o.status}`}>
                  {o.status.replace(/-/g, " ")}
                </span>
                <span className="serif">{o.total} Birr</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}