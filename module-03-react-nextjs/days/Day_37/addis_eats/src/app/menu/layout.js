import CategoryBar from "./CategoryBar";

export default function MenuLayout({ children }) {
  return (
    <div className="menu-layout">
      <aside className="menu-sidebar">
        <CategoryBar
          categories={["All", "Starters", "Mains", "Desserts", "Drinks"]}
          active="All"
        />
      </aside>
      <div className="menu-content">{children}</div>
    </div>
  );
}