"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function OrdersLineChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-[280px] text-neutral-500 text-sm"
        aria-hidden="true"
      >
        No order data to display.
      </div>
    );
  }

  return (
    // Fixed height — prevents CLS and gives ResponsiveContainer a real size.
    <div className="w-full h-[280px] mb-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" />

          <XAxis
            dataKey="label"
            stroke="#a1a1a1"
            tick={{ fill: "#a1a1a1", fontSize: 11 }}
            tickLine={false}
            interval="preserveStartEnd"
          />

          <YAxis
            stroke="#a1a1a1"
            tick={{ fill: "#a1a1a1", fontSize: 12 }}
            tickLine={false}
            width={40}
            allowDecimals={false}
            // Line charts may start above zero — they show change, not length.
            domain={[0, "auto"]}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#171717",
              border: "1px solid #262626",
              borderRadius: "8px",
              color: "#ededed",
              fontSize: "12px",
            }}
            formatter={(value) => [`${value} orders`, "Orders"]}
            labelStyle={{ color: "#a1a1a1" }}
          />

          <Line
            type="monotone"
            dataKey="orders"
            stroke="#fbbf24"
            strokeWidth={2}
            dot={{ fill: "#fbbf24", r: 3 }}
            activeDot={{ r: 5, fill: "#fcd34d" }}
            name="Orders"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}