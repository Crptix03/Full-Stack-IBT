"use client";

import { useState } from "react";

export default function FilterShell({ children }) {
  const [sort, setSort] = useState("default");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center pb-4 border-b border-neutral-800 text-sm text-neutral-400">
        <label className="flex gap-2 items-center">
          Sort:
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-neutral-900 border border-neutral-700 text-neutral-100 px-3 py-1 rounded text-sm focus:outline-none focus:border-amber-400"
          >
            <option value="default">Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </label>
      </div>
      {children}
    </div>
  );
}