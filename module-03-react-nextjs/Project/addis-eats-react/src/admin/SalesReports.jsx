import { useMemo } from "react";
import { useOrders } from "../context/OrderContext";

export default function SalesReports() {
  const { orders } = useOrders();
  const orderList = orders || [];

  const stats = useMemo(() => {
    const byDay = {};
    const byDish = {};

    orderList.forEach((o) => {
      const day = new Date(o.placedAt).toLocaleDateString();
      byDay[day] = (byDay[day] || 0) + (o.total || 0);

      o.items.forEach((i) => {
        if (!byDish[i.name]) byDish[i.name] = { qty: 0, revenue: 0 };
        byDish[i.name].qty += i.qty;
        byDish[i.name].revenue += i.qty * i.price;
      });
    });

    const topDishes = Object.entries(byDish)
      .sort((a, b) => b[1].qty - a[1].qty)
      .slice(0, 5);

    const bestDay = Object.entries(byDay).sort((a, b) => b[1] - a[1])[0];

    return { byDay, topDishes, bestDay };
  }, [orderList]);

  return (
    <section>
      <header className="admin-page-head">
        <h1 className="serif">Sales Reports</h1>
        <p>Overview of revenue and top-performing dishes</p>
      </header>

      <div className="report-grid">
        <div className="report-card">
          <h3 className="serif">Daily Revenue</h3>
          {Object.entries(stats.byDay).map(([day, total]) => (
            <div className="mini-row" key={day}>
              <span>{day}</span>
              <span className="serif">{total} Birr</span>
            </div>
          ))}
          {!Object.keys(stats.byDay).length && (
            <p className="empty-text">No data yet</p>
          )}
        </div>

        <div className="report-card">
          <h3 className="serif">Top Dishes</h3>
          {stats.topDishes.map(([name, data]) => (
            <div className="mini-row" key={name}>
              <span>{name}</span>
              <span>
                {data.qty} sold · {data.revenue} Birr
              </span>
            </div>
          ))}
          {!stats.topDishes.length && <p className="empty-text">No data yet</p>}
        </div>

        <div className="report-card highlight">
          <h3 className="serif">Best Day</h3>
          {stats.bestDay ? (
            <>
              <p className="big-number">{stats.bestDay[1]} Birr</p>
              <p className="muted">{stats.bestDay[0]}</p>
            </>
          ) : (
            <p className="empty-text">No data yet</p>
          )}
        </div>
      </div>
    </section>
  );
}