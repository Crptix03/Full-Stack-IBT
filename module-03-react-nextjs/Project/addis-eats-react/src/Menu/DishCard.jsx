import Button from "../ui/Button";

export default function DishCard({ dish, onAdd }) {
  return (
    <div className="dish-card">
      <div className="dish-card-media">
        <img src={`/${dish.img}`} alt={dish.name} />
        {dish.tag && (
          <span className={`dish-tag dish-tag-${dish.tagClass || "default"}`}>
            {dish.tag}
          </span>
        )}
      </div>
      <div className="dish-card-body">
        <h3 className="serif">{dish.name}</h3>
        <p>{dish.description}</p>
        <div className="dish-card-footer">
          <span className="dish-price serif">
            {dish.price} <sup>ETB</sup>
          </span>
          <Button onClick={() => onAdd(dish)}>+ Add to Order</Button>
        </div>
      </div>
    </div>
  );
}