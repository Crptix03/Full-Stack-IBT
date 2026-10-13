"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  // On mount, read the current theme from <html>
  useEffect(() => {
    setMounted(true);
    const current =
      document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(current);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  // Prevent flash of wrong icon on SSR — placeholder matches the
  // final button's size so no layout shift occurs.
  if (!mounted) {
    return (
      <button
        type="button"
        className="w-11 h-11 rounded-full border border-neutral-800"
        aria-hidden
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="w-11 h-11 rounded-full border border-neutral-700 hover:border-amber-400 flex items-center justify-center text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}