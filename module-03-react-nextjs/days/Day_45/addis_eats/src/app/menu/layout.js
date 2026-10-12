import { Suspense } from "react";
import CategoryBar from "./CategoryBar";

export default function MenuLayout({ children }) {
  const categories = [
    { slug: "all", label: "All" },
    { slug: "starters", label: "Starters" },
    { slug: "mains", label: "Mains" },
    { slug: "soups", label: "Soups" },
    { slug: "desserts", label: "Desserts" },
    { slug: "drinks", label: "Drinks" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 max-w-5xl">
      <aside className="md:border-r md:border-neutral-800 md:pr-6 border-b md:border-b-0 border-neutral-800 pb-4 md:pb-0">
        {/* Suspense boundary prevents useSearchParams in CategoryBar from
            blocking the server render of the main content column. */}
        <Suspense fallback={<CategoryBarSkeleton categories={categories} />}>
          <CategoryBar categories={categories} />
        </Suspense>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function CategoryBarSkeleton({ categories }) {
  return (
    <div className="flex flex-col gap-2">
      {categories.map((cat) => (
        <div
          key={cat.slug}
          className="px-4 py-2 rounded border border-neutral-700 text-sm text-neutral-200"
        >
          {cat.label}
        </div>
      ))}
    </div>
  );
}