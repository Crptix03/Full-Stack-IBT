import DishCard from "./DishCard";
import SearchBox from "./SearchBox";
import Pagination from "./Pagination";
import { getDishes } from "@/lib/dishes";

export const revalidate = 3600;

export const metadata = {
  title: "Menu",
  description:
    "Browse our full menu. Search for your favorites and order for delivery.",
};

const PAGE_SIZE = 12;

export default async function MenuPage({ searchParams }) {
  const { page = "1", q = "", category = "all" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  const all = await getDishes();

  // Filter by category
  let filtered =
    category === "all"
      ? all
      : all.filter((d) => d.category === category);

  // Filter by search
  if (q.trim()) {
    const term = q.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(term) ||
        d.category.toLowerCase().includes(term) ||
        (d.description && d.description.toLowerCase().includes(term))
    );
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const dishes = filtered.slice(start, start + PAGE_SIZE);
  const isDefaultView = !q.trim() && category === "all" && safePage === 1;

  return (
    <div>
      <h1 className="font-serif text-3xl text-amber-400 mb-6">Our Menu</h1>

      <SearchBox initialValue={q} />

      {dishes.length === 0 ? (
        <p className="text-neutral-400 py-12 text-center">
          No dishes match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishes.map((dish, index) => (
            <DishCard
              key={dish.id}
              dish={dish}
              priority={isDefaultView && index === 0}
            />
          ))}
        </div>
      )}

      <Pagination
        current={safePage}
        total={totalPages}
        query={[
          q ? `q=${encodeURIComponent(q)}` : "",
          category && category !== "all" ? `category=${category}` : "",
        ]
          .filter(Boolean)
          .join("&") + (q || category !== "all" ? "&" : "")}
      />
    </div>
  );
}