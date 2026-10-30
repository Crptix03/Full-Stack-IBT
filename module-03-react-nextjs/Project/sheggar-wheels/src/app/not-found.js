import Link from "next/link";
import { Search, ArrowLeft, Car } from "lucide-react";

export const metadata = { title: "Page Not Found" };

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-50">
      <div className="max-w-md w-full text-center">

        {/* Big 404 */}
        <div className="relative mb-8">
          <p className="text-[120px] font-black text-neutral-100 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <Search className="w-10 h-10 text-indigo-500" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-black text-neutral-900 mb-3">
          Page Not Found
        </h1>
        <p className="text-neutral-500 leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been
          moved. It might be a listing that was removed or a URL that was
          mistyped.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/cars"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Car className="w-4 h-4" />
            Browse Cars
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-neutral-200 text-neutral-700 font-semibold rounded-xl hover:border-indigo-400 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
