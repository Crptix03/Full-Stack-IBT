"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, use } from "react";
import { readStorage, KEYS } from "@/lib/storage";
import { signInAsDemo, safeReturnPath } from "@/lib/session";
import { hasRole, isActive } from "@/lib/auth";

export default function SignInPage({ searchParams }) {
  const router = useRouter();
  const params = use(searchParams);
  const next = safeReturnPath(params.next, "/");

  const [users, setUsers] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const all = readStorage(KEYS.USERS, []);
    setUsers(all.filter(isActive));
  }, []);

  const handleSignIn = (userId) => {
    signInAsDemo(userId);
    router.push(next);
    router.refresh();
  };

  if (!mounted) {
    return <div className="py-20 text-center text-neutral-500">Loading…</div>;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl text-amber-400 mb-2 text-center">
        Demo Sign In
      </h1>
      <p className="text-neutral-500 text-sm text-center mb-8">
        This is a demo. Pick an account to explore different roles.
      </p>

      <div className="space-y-3">
        {users.map((user) => (
          <button
            key={user.id}
            type="button"
            onClick={() => handleSignIn(user.id)}
            className="w-full text-left p-4 border border-neutral-800 rounded-lg bg-neutral-900/40 hover:border-amber-400/50 hover:bg-neutral-900 transition-colors"
          >
            <div className="flex justify-between items-baseline mb-1">
              <p className="text-neutral-100 font-medium">{user.name}</p>
              <div className="flex gap-1">
                {user.roles.map((r) => (
                  <span
                    key={r}
                    className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-xs text-neutral-500">{user.email}</p>
          </button>
        ))}
      </div>

      <p className="mt-8 text-xs text-neutral-600 text-center">
        No passwords. No real accounts. This is a UI demonstration.
      </p>
    </div>
  );
}