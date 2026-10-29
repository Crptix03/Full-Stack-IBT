import Link from "next/link";
import { ShieldX, ArrowLeft, LogIn } from "lucide-react";

export const metadata = { title: "Not Authorized" };

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-50">
      <div className="max-w-md w-full text-center">

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-100 text-red-500 mb-6">
          <ShieldX className="w-10 h-10" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-black text-neutral-900 mb-3">
          Not Authorized
        </h1>

        {/* Message */}
        <p className="text-neutral-500 leading-relaxed mb-8">
          You don&apos;t have permission to access this page. This could be
          because you&apos;re not signed in, or your account doesn&apos;t have
          the required role.
        </p>

        {/* Role hint cards */}
        <div className="grid grid-cols-3 gap-3 mb-8 text-xs">
          <div className="p-3 bg-white border border-neutral-200 rounded-xl">
            <p className="font-bold text-neutral-900 mb-1">Renters</p>
            <p className="text-neutral-500">/dashboard<br />/bookings<br />/checkout</p>
          </div>
          <div className="p-3 bg-white border border-neutral-200 rounded-xl">
            <p className="font-bold text-neutral-900 mb-1">Owners</p>
            <p className="text-neutral-500">/owner<br />/owner/cars<br />/owner/earnings</p>
          </div>
          <div className="p-3 bg-white border border-neutral-200 rounded-xl">
            <p className="font-bold text-neutral-900 mb-1">Admins</p>
            <p className="text-neutral-500">/admin<br />/admin/users<br />/admin/reports</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signin"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-neutral-200 text-neutral-700 font-semibold rounded-xl hover:border-indigo-400 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </Link>
        </div>

        <p className="mt-8 text-xs text-neutral-400">
          If you think this is a mistake, try signing out and back in.
        </p>
      </div>
    </div>
  );
}
