import { memo, useCallback } from "react";
import Dish from "./Dish";
import Card from "./Card";

const MemoDish = memo(Dish);

function DishList({ dishes, dispatch }) {
  const handleAdd = useCallback(
    dish => dispatch({ type: "ADD", dish }),
    [dispatch]
  );

  if (dishes.length === 0) return <p>No dishes in this category yet.</p>;

  return (
    <div className="menu">
      {dishes.map(d => (
        <Card key={d.id}>
          <MemoDish dish={d} onAdd={handleAdd} />
        </Card>
      ))}
    </div>
  );
}

export default DishList;