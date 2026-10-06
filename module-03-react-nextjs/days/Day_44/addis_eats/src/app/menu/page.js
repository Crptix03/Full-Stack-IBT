import DishCard from "./DishCard";
import SearchBox from "./SearchBox";
import Pagination from "./Pagination";
import { getDishes } from "@/lib/dishes";

export const revalidate = 3600;

// ── Day 44: Static Metadata ────────────────────────────
export const metadata = {
  title: "Menu",
  description:
    "Browse our full menu. Search for your favorites and order for delivery.",
};

const PAGE_SIZE = 10;

export default async function MenuPage({ searchParams }) {
  const { page = "1", q = "" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  const all = await getDishes();

  const filtered = q.trim()
    ? all.filter(
        (d) =>
          d.name.toLowerCase().includes(q.toLowerCase()) ||
          d.category.toLowerCase().includes(q.toLowerCase())
      )
    : all;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const dishes = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <h1 className="font-serif text-3xl text-amber-400 mb-6">
        Our Menu
      </h1>

      <SearchBox initialValue={q} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map((dish, index) => (
          <DishCard key={dish.id} dish={dish} isFirst={index === 0} />
        ))}
      </div>

      <Pagination
        current={safePage}
        total={totalPages}
        query={q ? `q=${encodeURIComponent(q)}&` : ""}
      />
    </div>
  );
}