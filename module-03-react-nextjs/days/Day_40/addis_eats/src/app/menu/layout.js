import CategoryBar from "./CategoryBar";

export default function MenuLayout({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 max-w-5xl">
      <aside className="md:border-r md:border-neutral-800 md:pr-6 border-b md:border-b-0 border-neutral-800 pb-4 md:pb-0">
        <CategoryBar
          categories={["All", "Starters", "Mains", "Desserts", "Drinks"]}
        />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}