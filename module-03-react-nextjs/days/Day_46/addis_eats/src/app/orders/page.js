import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getOrdersFor } from "@/lib/orders";
import OrderTable from "./OrderTable";
import Pagination from "./Pagination";

export const metadata = {
  title: "My Orders",
  description: "View and sort your order history.",
};

const PAGE_SIZE = 10;

// Sort key → comparison function.
// Uses the raw order fields; no need to pre-sort in the data layer.
const SORTERS = {
  id: (a, b) => a.id.localeCompare(b.id),
  date: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  items: (a, b) => (a.items?.length || 0) - (b.items?.length || 0),
  total: (a, b) => (a.total || 0) - (b.total || 0),
  status: (a, b) => (a.status || "").localeCompare(b.status || ""),
};

export default async function OrdersPage({ searchParams }) {
  const session = await getSession();
  if (!session) redirect("/signin?next=/orders");

  // Read sort + page from the URL. Defaults: newest first, page 1.
  const params = await searchParams;
  const sort = SORTERS[params.sort] ? params.sort : "date";
  const dir = params.dir === "asc" ? "asc" : "desc";
  const page = Math.max(1, parseInt(params.page, 10) || 1);

  // Scoped query — only the signed-in user's orders.
  const userOrders = getOrdersFor(session.userId);

  // Sort in memory (cheap — a few dozen rows).
  const sorted = [...userOrders].sort(SORTERS[sort]);
  if (dir === "desc") sorted.reverse();

  // Paginate.
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageRows = sorted.slice(start, start + PAGE_SIZE);

  // ── Empty state ────────────────────────────────────
  if (userOrders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="text-6xl mb-6">📦</div>
        <h1 className="font-serif text-4xl text-amber-400 mb-4">
          No Orders Yet
        </h1>
        <p className="text-neutral-400 mb-8 max-w-md mx-auto">
          When you place an order, it will show up here so you can track
          its status and view your past meals.
        </p>
        <Link
          href="/menu"
          className="inline-block px-8 py-3 bg-amber-400 text-neutral-900 font-semibold rounded-lg hover:bg-amber-300 transition-colors"
        >
          Browse the Menu
        </Link>
      </div>
    );
  }

  // ── Loaded state ───────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-baseline justify-between mb-8 gap-4">
        <h1 className="font-serif text-3xl text-amber-400">
          My Orders
        </h1>
        <p className="text-xs text-neutral-500">
          {userOrders.length} order{userOrders.length === 1 ? "" : "s"} total
        </p>
      </div>

      <OrderTable
        orders={pageRows}
        sortedBy={sort}
        sortDir={dir}
      />

      <Pagination
        current={safePage}
        total={totalPages}
        sort={sort}
        dir={dir}
      />
    </div>
  );
}