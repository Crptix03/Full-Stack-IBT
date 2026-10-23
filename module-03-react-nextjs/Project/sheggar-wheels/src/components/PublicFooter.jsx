import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between gap-4 text-xs text-neutral-500">
        <p>© 2026 Sheggar Wheels. Peer-to-peer car rental in Addis Ababa.</p>
        <div className="flex gap-4">
          <Link href="/" className="hover:text-amber-400 transition-colors">
            Home
          </Link>
          <Link href="/cars" className="hover:text-amber-400 transition-colors">
            Browse
          </Link>
          <Link href="/signin" className="hover:text-amber-400 transition-colors">
            Sign In
          </Link>
        </div>
        <p className="text-neutral-600">Demo data — not a real rental service.</p>
      </div>
    </footer>
  );
}