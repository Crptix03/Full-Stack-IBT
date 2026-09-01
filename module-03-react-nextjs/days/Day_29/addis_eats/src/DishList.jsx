import Dish from "./Dish";
import Card from "./Card";

function DishList({ dishes, onAdd }) {
  if (dishes.length === 0) {
    return <p>No dishes in this category yet.</p>;
  }

  return (
    <div className="menu">
      {dishes.map(d => (
        <Card key={d.id}>
          <Dish {...d} onAdd={onAdd} />
        </Card>
      ))}
    </div>
  );
}

export default DishList;