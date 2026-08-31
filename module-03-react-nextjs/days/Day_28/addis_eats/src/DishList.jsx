import Dish from "./Dish";
import Card from "./Card";
import menuData from "./data";

function DishList({ category, onAdd }) {
  const shown = category === "all"
    ? menuData
    : menuData.filter(d => d.category === category);

  if (shown.length === 0) {
    return <p>No dishes in this category yet.</p>;
  }

  return (
    <div className="menu">
      {shown.map(d => (
        <Card key={d.id}>
          <Dish {...d} onAdd={onAdd} />
        </Card>
      ))}
    </div>
  );
}

export default DishList;