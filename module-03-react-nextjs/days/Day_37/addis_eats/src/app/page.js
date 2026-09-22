import Link from "next/link";

export default function HomePage() {
  return (
    <div className="home-page">
      <h1>Addis Eats</h1>
      <p>Welcome to our restaurant.</p>
      <nav className="home-nav">
        <Link href="/menu">Menu</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/checkout">Checkout</Link>
      </nav>
    </div>
  );
}