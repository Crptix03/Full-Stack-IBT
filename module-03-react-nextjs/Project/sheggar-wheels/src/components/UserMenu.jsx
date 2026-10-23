"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut } from "@/lib/session";
import { isOwner, isAdmin, isRenter } from "@/lib/auth";

export default function UserMenu({ user }) {
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

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const initials = (user?.name || "U").slice(0, 2).toUpperCase();

  const handleSignOut = () => {
    signOut();
    window.location.href = "/";
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-neutral-700 hover:border-amber-400/50 transition-colors"
      >
        <span className="w-7 h-7 rounded-full bg-amber-400 text-neutral-900 font-bold text-[11px] flex items-center justify-center">
          {initials}
        </span>
        <span className="text-neutral-200 text-sm capitalize">
          {user?.name?.split(" ")[0] || "User"}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl py-1 z-50"
        >
          <div className="px-4 py-2 text-xs text-neutral-500 border-b border-neutral-800">
            {user?.email}
          </div>

          {isRenter(user) && (
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-amber-400 transition-colors"
            >
              My Dashboard
            </Link>
          )}

          {isOwner(user) && (
            <Link
              href="/owner"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-amber-400 transition-colors"
            >
              Owner Dashboard
            </Link>
          )}

          {isAdmin(user) && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-amber-400 hover:bg-neutral-800 transition-colors"
            >
              Admin Panel
            </Link>
          )}

          <div className="border-t border-neutral-800 my-1" />

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-800 transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}