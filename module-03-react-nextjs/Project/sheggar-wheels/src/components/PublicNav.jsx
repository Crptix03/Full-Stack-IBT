import Link from "next/link";
import { Car } from "lucide-react";
import { getSession } from "@/lib/session";
import { findUserById } from "@/lib/users";
import UserMenu from "@/components/UserMenu";

export default async function PublicNav() {
  const session = await getSession();
  const user = session ? findUserById(session.userId) : null;

  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg text-indigo-600"
        >
          <Car className="w-5 h-5" />
          Sheggar Wheels
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/cars"
            className="text-neutral-700 hover:text-indigo-600 transition-colors font-medium"
          >
            Browse Cars
          </Link>

          {user ? (
            /* Avatar dropdown — replaces the old "Name | Sign Out" */
            <UserMenu user={user} />
          ) : (
            <Link
              href="/signin"
              className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}