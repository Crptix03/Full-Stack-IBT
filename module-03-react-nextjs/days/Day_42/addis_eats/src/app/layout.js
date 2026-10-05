import Link from "next/link";
import { Inter } from "next/font/google";
import Script from "next/script";
import Providers from "../lib/context";
import { signOut } from "./actions";
import { getSession } from "@/lib/session";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Addis Eats",
  description: "A modern Ethiopian restaurant experience",
};

export default async function RootLayout({ children }) {
  // ── Auth Check (Day 42) ─────────────────────────────
  const session = await getSession();

  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
        
        {/* ── Third-Party Script (Day 43) ─────────────── */}
        {/* Loaded lazily so it does NOT block initial render */}
        <Script
          src="https://example.com/analytics.js"
          strategy="lazyOnload"
        />

        <Providers>
          <header className="flex justify-between items-center px-8 py-4 border-b border-neutral-800">
            <Link
              href="/"
              className="font-serif text-xl font-bold text-amber-400"
            >
              Addis Eats
            </Link>
            <nav className="flex gap-6 text-sm items-center">
              <Link href="/menu" className="hover:text-amber-400 transition-colors">
                Menu
              </Link>
              <Link href="/cart" className="hover:text-amber-400 transition-colors">
                Cart
              </Link>
              <Link href="/checkout" className="hover:text-amber-400 transition-colors">
                Checkout
              </Link>

              {/* ── Conditional Auth UI (Day 42) ──────── */}
              {session ? (
                <form action={signOut}>
                  <button
                    type="submit"
                    className="hover:text-amber-400 transition-colors"
                  >
                    Sign Out
                  </button>
                </form>
              ) : (
                <Link
                  href="/signin"
                  className="hover:text-amber-400 transition-colors"
                >
                  Sign In
                </Link>
              )}
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