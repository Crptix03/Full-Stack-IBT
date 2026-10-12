"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut } from "./actions";

export default function UserMenu({ username, role }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const initials = (username || "U").slice(0, 2).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border theme-border hover:border-amber-400/50 hover:bg-neutral-800/20 transition-colors"
      >
        <span className="w-7 h-7 rounded-full bg-amber-400 text-neutral-900 font-bold text-[11px] flex items-center justify-center">
          {initials}
        </span>
        <span className="theme-text text-sm capitalize">
          {username}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 theme-bg-elevated border theme-border rounded-lg shadow-xl py-1 z-50">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm theme-text hover:bg-neutral-800/20 hover:text-amber-400 transition-colors"
          >
            Profile
          </Link>
          <Link
            href="/orders"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm theme-text hover:bg-neutral-800/20 hover:text-amber-400 transition-colors"
          >
            My Orders
          </Link>

          {role === "staff" && (
            <Link
              href="/kitchen"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-amber-500 hover:bg-neutral-800/20 transition-colors"
            >
              Kitchen
            </Link>
          )}

          <div className="border-t theme-border my-1" />

          <form action={signOut}>
            <button
              type="submit"
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-neutral-800/20 transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}