import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import Link from "next/link";

const TABS = [
  { href: "/admin",           label: "Overview" },
  { href: "/admin/listings",  label: "Listings" },
  { href: "/admin/users",     label: "Users" },
  { href: "/admin/bookings",  label: "Bookings" },
  { href: "/admin/disputes",  label: "Disputes" },
  { href: "/admin/reports",   label: "Reports" },
];

// Middleware already blocks non-admin access.
export default function AdminLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNav />
      <nav className="border-b border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex gap-6 text-sm overflow-x-auto">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="py-3 border-b-2 border-transparent text-neutral-600 hover:text-indigo-600 whitespace-nowrap transition-colors"
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>
      <main className="flex-1 bg-neutral-50">{children}</main>
      <PublicFooter />
    </div>
  );
}
