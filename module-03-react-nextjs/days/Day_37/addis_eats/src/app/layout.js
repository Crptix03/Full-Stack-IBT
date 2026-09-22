import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Addis Eats",
  description: "A modern Ethiopian restaurant experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link href="/" className="brand">Addis Eats</Link>
          <nav>
            <Link href="/menu">Menu</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/checkout">Checkout</Link>
          </nav>
        </header>

        <main className="site-main">{children}</main>

        <footer className="site-footer">
          <p>© {new Date().getFullYear()} Addis Eats</p>
        </footer>
      </body>
    </html>
  );
}