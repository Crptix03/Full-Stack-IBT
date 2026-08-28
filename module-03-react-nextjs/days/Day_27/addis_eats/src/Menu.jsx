import Dish from "./Dish";
import Card from "./Card";
import menuData from "./data";

const categories = ["all", "starters", "mains", "soups", "desserts", "drinks"];
const category = "all"; 

function Menu() {
  return (
    <div>
      <nav className="category-filter">
        {categories.map(c => (
          <button key={c} className={c === category ? "active" : ""}>
            {c}
          </button>
        ))}
      </nav>

      {categories
        .filter(c => c !== "all")
        .map(c => {
          const items = menuData.filter(d => d.category === c);
          if (items.length === 0) return null;

          return (
            <section key={c} className="category-section">
              <h2>{c}</h2>
              <div className="menu">
                {items.map(d => (
                  <Card key={d.id}>
                    <Dish name={d.name} price={d.price} spicy={d.spicy} />
                  </Card>
                ))}
              </div>
            </section>
          );
        })}
    </div>
  );
}

export default Menu;