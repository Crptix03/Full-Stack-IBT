import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import Link from "next/link";

// Middleware already blocks unauthenticated access.
// This layout just provides the nav tabs — no client-side guard needed.
export default function RenterLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNav />
      <nav className="border-b border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-2 flex gap-6 text-sm">
          <Link
            href="/dashboard"
            className="text-neutral-700 hover:text-indigo-600 transition-colors font-medium"
          >
            Dashboard
          </Link>
          <Link
            href="/bookings"
            className="text-neutral-700 hover:text-indigo-600 transition-colors font-medium"
          >
            My Bookings
          </Link>
        </div>
      </nav>
      <main className="flex-1 bg-neutral-50">{children}</main>
      <PublicFooter />
    </div>
  );
}
