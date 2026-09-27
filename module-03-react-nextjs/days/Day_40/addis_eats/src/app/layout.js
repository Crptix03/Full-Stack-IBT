import Link from "next/link";
import Providers from "../lib/providers";
import "./globals.css";

export const metadata = {
  title: "Addis Eats",
  description: "A modern Ethiopian restaurant experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
        <Providers>
          <header className="flex justify-between items-center px-8 py-4 border-b border-neutral-800">
            <Link
              href="/"
              className="font-serif text-xl font-bold text-amber-400"
            >
              Addis Eats
            </Link>
            <nav className="flex gap-6 text-sm">
              <Link href="/menu" className="hover:text-amber-400 transition-colors">
                Menu
              </Link>
              <Link href="/cart" className="hover:text-amber-400 transition-colors">
                Cart
              </Link>
              <Link href="/checkout" className="hover:text-amber-400 transition-colors">
                Checkout
              </Link>
            </nav>
          </header>

          <main className="flex-1 p-8 max-w-6xl w-full mx-auto">
            {children}
          </main>

          <footer className="px-8 py-6 border-t border-neutral-800 text-center text-xs text-neutral-500">
            © {new Date().getFullYear()} Addis Eats
          </footer>
        </Providers>
      </body>
    </html>
  );
}