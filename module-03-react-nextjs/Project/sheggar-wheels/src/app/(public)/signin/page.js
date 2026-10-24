"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, use } from "react";
import { readStorage, KEYS } from "@/lib/storage";
import { signInAsDemo, safeReturnPath } from "@/lib/session";
import { isActive } from "@/lib/auth";
import { Mail } from "lucide-react";

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
    return (
      <div className="py-20 text-center text-neutral-500">Loading…</div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-black text-neutral-900 mb-2 text-center">
        Demo Sign In
      </h1>
      <p className="text-neutral-600 text-sm text-center mb-10">
        This is a demo. Pick an account to explore different roles.
      </p>

      <div className="space-y-3">
        {users.map((user) => (
          <button
            key={user.id}
            type="button"
            onClick={() => handleSignIn(user.id)}
            className="w-full text-left p-5 bg-white border border-neutral-200 rounded-2xl hover:border-indigo-400 hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-2 gap-3">
              <p className="text-neutral-900 font-semibold text-lg group-hover:text-indigo-600 transition-colors">
                {user.name}
              </p>
              <div className="flex gap-1 shrink-0">
                {user.roles.map((r) => (
                  <span
                    key={r}
                    className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${
                      r === "admin"
                        ? "bg-indigo-100 text-indigo-700"
                        : r === "owner"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-xs text-neutral-500 flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {user.email}
            </p>
          </button>
        ))}
      </div>

      <p className="mt-10 text-xs text-neutral-400 text-center">
        No passwords. No real accounts. This is a UI demonstration.
      </p>
    </div>
  );
}