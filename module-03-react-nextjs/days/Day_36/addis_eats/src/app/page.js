import Link from "next/link";

export default function Home() {
  return (
    <div className="home-page">
      <h1>Addis Eats</h1>
      <p>Welcome to our restaurant. Explore the menu and order your favorites.</p>

      <nav className="home-nav">
        <Link href="/Menu">Menu</Link>
        <Link href="/Cart">Cart</Link>
        <Link href="/Checkout">Checkout</Link>
      </nav>
    </div>
  );
}