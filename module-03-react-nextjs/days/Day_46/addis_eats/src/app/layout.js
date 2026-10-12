import Link from "next/link";
import { Playfair_Display, Jost } from "next/font/google";
import Script from "next/script";
import Providers from "../lib/context";
import { getSession } from "@/lib/session";
import { findUserById } from "@/lib/users";
import CartBadge from "./CartBadge";
import UserMenu from "./UserMenu";
import ThemeToggle from "./ThemeToggle";
import "./globals.css";

// Body font — only the two weights actually used, with fallback metric
// adjustments so the FOUT swap doesn't cause a layout shift.
const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-jost",
  adjustFontFallback: true,
});

// Heading font — regular + bold only, with adjusted fallback metrics so the
// fallback and web font render at near-identical size (reduces CLS on swap).
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-playfair",
  adjustFontFallback: true,
  preload: true,
});

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

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default async function RootLayout({ children }) {
  const session = await getSession();
  const user = session ? findUserById(session.userId) : null;

  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${jost.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <Script
          src="/scripts/analytics.js"
          strategy="lazyOnload"
        />

        {/*
          CartProvider wraps only the header nav (CartBadge needs cart state)
          and children. The footer needs nothing from context so it stays outside.
          Keeping the provider boundary tight means less JS on the critical path.
        */}
        <Providers>
          <header className="sticky top-0 z-50 backdrop-blur-md border-b theme-border app-header">
            <div className="flex justify-between items-center px-8 py-4 max-w-6xl mx-auto w-full">
              <Link
                href="/"
                className="font-serif text-xl font-bold text-amber-500"
              >
                Addis Eats
              </Link>
              <nav className="flex gap-6 text-sm items-center">
                <NavLink href="/menu">Menu</NavLink>
                <NavLink href="/cart">
                  Cart
                  <CartBadge />
                </NavLink>
                {session && <NavLink href="/orders">Orders</NavLink>}
                {session && user?.role === "staff" && (
                  <NavLink href="/dashboard">Dashboard</NavLink>
                )}
                <NavLink href="/checkout">Checkout</NavLink>

                <ThemeToggle />

                {user ? (
                  <UserMenu username={user.username} role={user.role} />
                ) : (
                  <NavLink href="/signin">Sign In</NavLink>
                )}
              </nav>
            </div>
          </header>

          <main className="flex-1 px-8 py-12 max-w-6xl w-full mx-auto">
            {children}
          </main>
        </Providers>

        <footer className="px-8 py-8 border-t theme-border">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs theme-text-muted">
            <p>© {new Date().getFullYear()} Addis Eats</p>
            <p>Great food, delivered fresh.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="theme-text hover:text-amber-500 transition-colors inline-flex items-center"
    >
      {children}
    </Link>
  );
}
