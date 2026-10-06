import DishList from "./DishList";
import SearchBox from "./SearchBox";
import Pagination from "./Pagination";
import { getDishes } from "@/lib/dishes";

export const revalidate = 3600;

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

      <DishList dishes={dishes} />

      <Pagination
        current={safePage}
        total={totalPages}
        query={q ? `q=${encodeURIComponent(q)}&` : ""}
      />
    </div>
  );
}