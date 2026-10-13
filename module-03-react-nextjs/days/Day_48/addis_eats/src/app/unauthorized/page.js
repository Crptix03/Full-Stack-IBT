import Link from "next/link";

export const metadata = {
  title: "Not authorized",
  description: "You don't have permission to view this page.",
};

export default function UnauthorizedPage() {
  return (
    <div className="max-w-md mx-auto text-center py-20">
      <div className="text-6xl mb-6">🔒</div>
      <h1 className="font-serif text-3xl text-amber-400 mb-3">
        Not authorized
      </h1>
      <p className="text-neutral-400 mb-8 leading-relaxed">
        You don&apos;t have permission to view this page. This area is
        for restaurant staff only.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link
          href="/"
          className="px-5 py-2 bg-amber-400 text-neutral-900 text-sm font-semibold rounded hover:bg-amber-300 transition-colors"
        >
          Back to home
        </Link>
        <Link
          href="/menu"
          className="px-5 py-2 border border-neutral-700 text-neutral-300 text-sm font-semibold rounded hover:border-amber-400 hover:text-amber-400 transition-colors"
        >
          View menu
        </Link>
      </div>
    </div>
  );
}