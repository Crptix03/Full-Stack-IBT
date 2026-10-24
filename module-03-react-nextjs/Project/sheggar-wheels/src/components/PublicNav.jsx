"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentSession } from "@/lib/session";
import { isOwner, isAdmin, isRenter } from "@/lib/auth";
import UserMenu from "./UserMenu";
import { Car } from "lucide-react";

export default function PublicNav() {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(getCurrentSession());
  }, []);

  if (!mounted) {
    return (
      <header className="border-b border-neutral-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <span className="font-bold text-lg text-indigo-600">
            Sheggar Wheels
          </span>
        </div>
      </header>
    );
  }

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

          {user && isRenter(user) && (
            <Link
              href="/dashboard"
              className="text-neutral-700 hover:text-indigo-600 transition-colors font-medium"
            >
              Dashboard
            </Link>
          )}

          {user && isOwner(user) && (
            <Link
              href="/owner"
              className="text-neutral-700 hover:text-indigo-600 transition-colors font-medium"
            >
              My Cars
            </Link>
          )}

          {user && isAdmin(user) && (
            <Link
              href="/admin"
              className="text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
            >
              Admin
            </Link>
          )}

          {user ? (
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