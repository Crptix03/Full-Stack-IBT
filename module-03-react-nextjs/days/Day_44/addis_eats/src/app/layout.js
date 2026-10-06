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

// ── Day 44: SEO Metadata ─────────────────────────────
export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Addis Eats",
    template: "%s | Addis Eats",
  },
  description:
    "Great food, delivered fresh. Browse the menu and order your favorites from Addis Eats.",
  openGraph: {
    title: "Addis Eats",
    description: "Great food, delivered fresh.",
    url: "/",
    siteName: "Addis Eats",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Addis Eats",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default async function RootLayout({ children }) {
  const session = await getSession();

  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
        <Script
          src="https://example.com/analytics.js"
          strategy="lazyOnload"
        />

        <Providers>
          {/* ── Header ────────────────────────────── */}
          <header className="flex justify-between items-center px-8 py-4 border-b border-neutral-800">
            <Link
              href="/"
              className="font-serif text-xl font-bold text-amber-400"
            >
              Addis Eats
            </Link>
            <nav className="flex gap-6 text-sm items-center">
              <Link
                href="/menu"
                className="hover:text-amber-400 transition-colors"
              >
                Menu
              </Link>
              <Link
                href="/cart"
                className="hover:text-amber-400 transition-colors"
              >
                Cart
              </Link>
              <Link
                href="/checkout"
                className="hover:text-amber-400 transition-colors"
              >
                Checkout
              </Link>

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

          {/* ── Main Content ──────────────────────── */}
          <main className="flex-1 p-8 max-w-6xl w-full mx-auto">
            {children}
          </main>

          {/* ── Footer ────────────────────────────── */}
          <footer className="px-8 py-6 border-t border-neutral-800 text-center text-xs text-neutral-500">
            © {new Date().getFullYear()} Addis Eats
          </footer>
        </Providers>
      </body>
    </html>
  );
}