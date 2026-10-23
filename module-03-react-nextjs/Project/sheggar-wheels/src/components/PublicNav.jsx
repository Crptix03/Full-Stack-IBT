"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentSession } from "@/lib/session";
import { isOwner, isAdmin, isRenter } from "@/lib/auth";
import UserMenu from "./UserMenu";

export default function PublicNav() {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(getCurrentSession());
  }, []);

  if (!mounted) {
    return (
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <span className="font-serif text-xl font-bold text-amber-500">
            Sheggar Wheels
          </span>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="font-serif text-xl font-bold text-amber-500 whitespace-nowrap"
        >
          Sheggar Wheels
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link
            href="/cars"
            className="text-neutral-300 hover:text-amber-400 transition-colors"
          >
            Browse Cars
          </Link>

          {user && (
            <>
              {isRenter(user) && (
                <Link
                  href="/dashboard"
                  className="text-neutral-300 hover:text-amber-400 transition-colors"
                >
                  Dashboard
                </Link>
              )}
              {isOwner(user) && (
                <Link
                  href="/owner"
                  className="text-neutral-300 hover:text-amber-400 transition-colors"
                >
                  My Cars
                </Link>
              )}
              {isAdmin(user) && (
                <Link
                  href="/admin"
                  className="text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Admin
                </Link>
              )}
              <UserMenu user={user} />
            </>
          )}

          {!user && (
            <Link
              href="/signin"
              className="px-4 py-2 bg-amber-400 text-neutral-900 font-semibold rounded hover:bg-amber-300 transition-colors"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}