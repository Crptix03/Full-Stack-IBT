import Link from "next/link";

export default function CartPage() {
  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <p>Cart items will go here.</p>
      <Link href="/">← Home</Link>
    </div>
  );
}