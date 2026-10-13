"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// Format a number as ETB currency, no decimals.
const etb = (value) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(value);

export default function RevenueChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-[300px] text-neutral-500 text-sm"
        aria-hidden="true"
      >
        No revenue data to display.
      </div>
    );
  }

  return (
    // Fixed-height wrapper — prevents CLS and gives ResponsiveContainer
    // a real height to measure against.
    <div className="w-full h-[300px] mb-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" />

          <XAxis
            dataKey="area"
            stroke="#a1a1a1"
            tick={{ fill: "#a1a1a1", fontSize: 12 }}
            tickLine={false}
          />

          <YAxis
            stroke="#a1a1a1"
            tick={{ fill: "#a1a1a1", fontSize: 12 }}
            tickLine={false}
            width={80}
            tickFormatter={(v) => etb(v)}
            // Bar axes MUST start at zero — a truncated bar lies.
            domain={[0, "auto"]}
          />

          <Tooltip
            cursor={{ fill: "rgba(251, 191, 36, 0.08)" }}
            contentStyle={{
              backgroundColor: "#171717",
              border: "1px solid #262626",
              borderRadius: "8px",
              color: "#ededed",
              fontSize: "12px",
            }}
            formatter={(value) => [etb(value), "Revenue"]}
            labelStyle={{ color: "#a1a1a1" }}
          />

          <Bar
            dataKey="revenue"
            fill="#fbbf24"
            radius={[4, 4, 0, 0]}
            name="Revenue"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}