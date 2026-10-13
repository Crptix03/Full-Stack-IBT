"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut } from "./actions";

export default function UserMenu({ username, role }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Close on Escape — and return focus to the toggle button
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Move focus into the menu when it opens
  useEffect(() => {
    if (open && menuRef.current) {
      const firstLink = menuRef.current.querySelector("a, button");
      firstLink?.focus();
    }
  }, [open]);

  const initials = (username || "U").slice(0, 2).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 pl-1 pr-3 min-h-[44px] rounded-full border theme-border hover:border-amber-400/50 hover:bg-neutral-800/20 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
      >
        <span className="w-7 h-7 rounded-full bg-amber-400 text-neutral-900 font-bold text-[11px] flex items-center justify-center">
          {initials}
        </span>
        <span className="theme-text text-sm capitalize">
          {username}
        </span>
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          className="absolute right-0 mt-2 w-44 theme-bg-elevated border theme-border rounded-lg shadow-xl py-1 z-50"
        >
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm theme-text hover:bg-neutral-800/20 hover:text-amber-400 focus-visible:outline-none focus-visible:bg-neutral-800/30 focus-visible:text-amber-400 transition-colors"
          >
            Profile
          </Link>
          <Link
            href="/orders"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm theme-text hover:bg-neutral-800/20 hover:text-amber-400 focus-visible:outline-none focus-visible:bg-neutral-800/30 focus-visible:text-amber-400 transition-colors"
          >
            My Orders
          </Link>

          {role === "staff" && (
            <Link
              href="/kitchen"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-amber-500 hover:bg-neutral-800/20 focus-visible:outline-none focus-visible:bg-neutral-800/30 transition-colors"
            >
              Kitchen
            </Link>
          )}

          <div className="border-t theme-border my-1" />

          <form action={signOut}>
            <button
              type="submit"
              role="menuitem"
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-neutral-800/20 focus-visible:outline-none focus-visible:bg-neutral-800/30 transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}