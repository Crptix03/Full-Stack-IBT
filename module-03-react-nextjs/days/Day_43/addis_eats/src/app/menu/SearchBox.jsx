"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBox({ initialValue = "" }) {
  const [term, setTerm] = useState(initialValue);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (term.trim()) {
        params.set("q", term.trim());
      } else {
        params.delete("q");
      }
      params.delete("page");
      router.replace(`/menu?${params.toString()}`);
    }, 300);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  return (
    <div className="mb-4">
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search dishes…"
        className="w-full bg-neutral-900 border border-neutral-700 text-neutral-100 px-3 py-2 rounded focus:outline-none focus:border-amber-400"
      />
    </div>
  );
}