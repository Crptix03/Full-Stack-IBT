"use client";

import useSWR from "swr";
import OrderTable from "./OrderTable";
import Pagination from "./Pagination";

const fetcher = (url) => fetch(url).then((r) => r.json());

const PAGE_SIZE = 10;

const SORTERS = {
  id: (a, b) => a.id.localeCompare(b.id),
  date: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  items: (a, b) => (a.items?.length || 0) - (b.items?.length || 0),
  total: (a, b) => (a.total || 0) - (b.total || 0),
  status: (a, b) => (a.status || "").localeCompare(b.status || ""),
};

export default function OrdersLive({
  initialOrders,
  allOrders,
  sort,
  dir,
  page,
}) {
  // Do we have any order that could still change? If not, stop polling.
  const hasActive = allOrders.some(
    (o) => o.status === "pending" || o.status === "preparing"
  );

  const { data: fetched } = useSWR("/api/orders", fetcher, {
    fallbackData: allOrders,
    refreshInterval: hasActive ? 10000 : 0, // 10 s while active, off otherwise
    revalidateOnFocus: true,
  });

  const current = fetched ?? allOrders;

  // Re-sort after each poll so the client stays in sync with the URL.
  const sorted = [...current].sort(SORTERS[sort] ?? SORTERS.date);
  if (dir === "desc") sorted.reverse();

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageRows = sorted.slice(start, start + PAGE_SIZE);

  return (
    <>
      <OrderTable orders={pageRows} sortedBy={sort} sortDir={dir} />
      <Pagination current={safePage} total={totalPages} sort={sort} dir={dir} />
    </>
  );
}