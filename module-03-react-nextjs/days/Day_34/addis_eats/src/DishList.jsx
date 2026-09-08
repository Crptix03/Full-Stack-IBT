import { memo, useCallback } from "react";
import Dish from "./Dish";
import Card from "./Card";
import { useCartStore } from "./cart/cartStore";

const MemoDish = memo(Dish);

function DishList({ dishes }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = useCallback(dish => addItem(dish), [addItem]);

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