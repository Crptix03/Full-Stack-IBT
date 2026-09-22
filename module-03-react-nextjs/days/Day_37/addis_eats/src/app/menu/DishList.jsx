import Link from "next/link";

export default function DishList({ dishes }) {
  if (!dishes || dishes.length === 0) {
    return <p>No dishes match your search.</p>;
  }

  return (
    <ul className="dish-list">
      {dishes.map((dish) => (
        <li key={dish.id} className="dish-item">
          <Link href={`/menu/${dish.id}`}>
            <strong>{dish.name}</strong>
            <span> — {dish.price} Birr</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}