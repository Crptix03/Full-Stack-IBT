import Link from "next/link";
import { Car, ArrowLeft } from "lucide-react";

export default function EditCarNotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-neutral-100 text-neutral-400 mb-6">
        <Car className="w-10 h-10" />
      </div>
      <h1 className="text-2xl font-black text-neutral-900 mb-3">
        Car Not Found
      </h1>
      <p className="text-neutral-500 leading-relaxed mb-8">
        This car listing doesn&apos;t exist or doesn&apos;t belong to your account.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/owner/cars"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Car className="w-4 h-4" /> My Cars
        </Link>
        <Link
          href="/owner"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-neutral-200 text-neutral-700 font-semibold rounded-xl hover:border-indigo-400 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
      </div>
    </div>
  );
}
