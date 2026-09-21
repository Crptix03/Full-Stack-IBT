import Link from "next/link";

export default function DishList({ dishes }) {
  return (
    <ul className="dish-list">
      {dishes.map((dish) => (
        <li key={dish.id} className="dish-item">
          <Link href={`/Menu/${dish.id}`}>
            <strong>{dish.name}</strong>
            <span> — {dish.price} Birr</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}