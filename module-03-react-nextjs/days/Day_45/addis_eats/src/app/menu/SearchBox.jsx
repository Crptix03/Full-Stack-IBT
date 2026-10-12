"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function SearchBox({ initialValue = "", currentParams = "" }) {
  const [term, setTerm] = useState(initialValue);
  const [, startTransition] = useTransition();
  const router = useRouter();

  const handleChange = (e) => {
    const val = e.target.value;
    setTerm(val);

    const base = new URLSearchParams(currentParams);
    if (val.trim()) {
      base.set("q", val.trim());
    } else {
      base.delete("q");
    }
    base.delete("page");

    const qs = base.toString();
    // Debounce via a closure-captured timeout ref
    clearTimeout(handleChange._t);
    handleChange._t = setTimeout(() => {
      startTransition(() => {
        router.replace(`/menu${qs ? `?${qs}` : ""}`);
      });
    }, 300);
  };

  return (
    <div className="mb-4">
      <label htmlFor="dish-search" className="sr-only">
        Search dishes
      </label>
      <input
        id="dish-search"
        name="q"
        type="search"
        value={term}
        onChange={handleChange}
        placeholder="Search dishes…"
        className="w-full bg-neutral-900 border border-neutral-700 text-neutral-100 px-3 py-2 rounded focus:outline-none focus:border-amber-400"
        autoComplete="off"
      />
    </div>
  );
}