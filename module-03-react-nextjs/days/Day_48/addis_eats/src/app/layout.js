import Link from "next/link";
import { Playfair_Display, Jost } from "next/font/google";
import Script from "next/script";
import Providers from "../lib/context";
import { getSession } from "@/lib/session";
import { findUserById } from "@/lib/users";
import CartBadge from "./CartBadge";
import UserMenu from "./UserMenu";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";
import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-jost",
  adjustFontFallback: true,
});

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

// Resolve a display user from the session. Demo accounts come from
// users.js; Google users carry their info in the session directly.
function resolveUser(session) {
  if (!session) return null;

  if (session.provider === "google") {
    return {
      id: session.userId,
      username: session.username || "Google User",
      role: session.role || "customer",
    };
  }

  return findUserById(session.userId);
}

export default async function RootLayout({ children }) {
  const session = await getSession();
  const user = resolveUser(session);

  return (
    <html
      lang="en"
      data-theme="dark"
      data-scroll-behavior="smooth"
      className={`${jost.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />

        <Script src="/scripts/analytics.js" strategy="lazyOnload" />

        <Providers>
          <header className="sticky top-0 z-50 backdrop-blur-md border-b theme-border app-header">
            <div className="flex justify-between items-center gap-2 px-4 sm:px-8 py-2 max-w-6xl mx-auto w-full">
              <Link
                href="/"
                className="font-serif text-lg sm:text-xl font-bold text-amber-500 whitespace-nowrap shrink-0"
              >
                Addis Eats
              </Link>

              <nav className="flex gap-2 sm:gap-5 text-sm items-center">
                {/* Mobile-only: hamburger + theme toggle */}
                <div className="flex sm:hidden gap-1 items-center">
                  <MobileMenu user={user} />
                  <ThemeToggle />
                </div>

                {/* Desktop-only: full text nav */}
                <div className="hidden sm:flex gap-5 items-center">
                  <NavLink href="/menu">Menu</NavLink>
                  <NavLink href="/cart">
                    Cart
                    <CartBadge />
                  </NavLink>
                  {session && <NavLink href="/orders">Orders</NavLink>}
                  {user?.role === "staff" && (
                    <NavLink href="/dashboard">Dashboard</NavLink>
                  )}
                  <NavLink href="/checkout">Checkout</NavLink>

                  <span className="shrink-0">
                    <ThemeToggle />
                  </span>

                  {user ? (
                    <span className="shrink-0">
                      <UserMenu
                        username={user.username}
                        role={user.role}
                      />
                    </span>
                  ) : (
                    <NavLink href="/signin">Sign In</NavLink>
                  )}
                </div>
              </nav>
            </div>
          </header>

          <main className="flex-1 px-4 sm:px-8 py-8 sm:py-12 max-w-6xl w-full mx-auto">
            {children}
          </main>

          <footer className="px-4 sm:px-8 py-8 border-t theme-border">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs theme-text-muted">
              <p>© {new Date().getFullYear()} Addis Eats</p>
              <p>Great food, delivered fresh.</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="theme-text hover:text-amber-500 transition-colors inline-flex items-center min-h-[44px] shrink-0 whitespace-nowrap"
    >
      {children}
    </Link>
  );
}