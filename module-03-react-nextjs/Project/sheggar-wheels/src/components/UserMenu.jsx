"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "@/app/actions";
import { User, LayoutDashboard, Car, Shield, LogOut, ChevronDown } from "lucide-react";

export default function UserMenu({ user }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const firstName = user.name.split(" ")[0];

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl px-3 py-1.5 hover:bg-neutral-100 transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-white">{initials}</span>
        </div>
        <span className="text-sm font-medium text-neutral-700">{firstName}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-neutral-200 rounded-2xl shadow-lg overflow-hidden z-50">

          {/* User info header */}
          <div className="px-4 py-3 border-b border-neutral-100">
            <p className="text-sm font-semibold text-neutral-900 truncate">{user.name}</p>
            <p className="text-xs text-neutral-500 truncate">{user.email}</p>
          </div>

          {/* Links */}
          <ul className="py-1">
            <MenuItem
              href="/profile"
              icon={<User className="w-4 h-4" />}
              label="My Profile"
              onClick={() => setOpen(false)}
            />
            <MenuItem
              href="/dashboard"
              icon={<LayoutDashboard className="w-4 h-4" />}
              label="Dashboard"
              onClick={() => setOpen(false)}
            />
            {user.roles.includes("owner") && (
              <MenuItem
                href="/owner"
                icon={<Car className="w-4 h-4" />}
                label="Owner Panel"
                onClick={() => setOpen(false)}
              />
            )}
            {user.roles.includes("admin") && (
              <MenuItem
                href="/admin"
                icon={<Shield className="w-4 h-4" />}
                label="Admin Panel"
                onClick={() => setOpen(false)}
              />
            )}
          </ul>

          {/* Sign out */}
          <div className="border-t border-neutral-100 py-1">
            <form action={signOut}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ href, icon, label, onClick }) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
      >
        <span className="text-neutral-400">{icon}</span>
        {label}
      </Link>
    </li>
  );
}
