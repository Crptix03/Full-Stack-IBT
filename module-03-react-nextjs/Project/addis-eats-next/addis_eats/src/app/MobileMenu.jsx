"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut } from "./actions";
import CartBadge from "./CartBadge";

export default function MobileMenu({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

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

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open menu"
        aria-haspopup="menu"
        aria-expanded={open}
        className="w-11 h-11 rounded-full border theme-border hover:border-amber-400/50 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {open ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 theme-bg-elevated border theme-border rounded-xl shadow-xl py-2 z-50"
        >
          <MenuItem href="/menu" onClick={() => setOpen(false)}>
            Menu
          </MenuItem>
          <MenuItem href="/cart" onClick={() => setOpen(false)}>
            <span className="inline-flex items-center gap-2">
              Cart
              <CartBadge />
            </span>
          </MenuItem>

          {user && (
            <>
              <MenuItem href="/orders" onClick={() => setOpen(false)}>
                My Orders
              </MenuItem>
              <MenuItem href="/checkout" onClick={() => setOpen(false)}>
                Checkout
              </MenuItem>
              <div className="border-t theme-border my-1" />
              <MenuItem href="/profile" onClick={() => setOpen(false)}>
                Profile ({user.username})
              </MenuItem>
              {user.role === "staff" && (
                <>
                  <MenuItem href="/kitchen" onClick={() => setOpen(false)}>
                    Kitchen
                  </MenuItem>
                  <MenuItem href="/dashboard" onClick={() => setOpen(false)}>
                    Dashboard
                  </MenuItem>
                </>
              )}
              <div className="border-t theme-border my-1" />
              <form action={signOut}>
                <button
                  type="submit"
                  role="menuitem"
                  className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-neutral-800/30 transition-colors min-h-[44px]"
                >
                  Sign Out
                </button>
              </form>
            </>
          )}

          {!user && (
            <MenuItem href="/signin" onClick={() => setOpen(false)}>
              Sign In
            </MenuItem>
          )}
        </div>
      )}
    </div>
  );
}

function MenuItem({ href, onClick, children }) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className="block px-4 py-2.5 text-sm theme-text hover:bg-neutral-800/30 hover:text-amber-400 focus-visible:outline-none focus-visible:bg-neutral-800/30 focus-visible:text-amber-400 transition-colors min-h-[44px]"
    >
      {children}
    </Link>
  );
}