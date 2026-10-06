"use client";

import { useActionState, use } from "react";
import { signIn } from "@/app/actions";

export default function SignInPage({ searchParams }) {
  const [state, formAction, isPending] = useActionState(signIn, null);

  const resolvedSearchParams = use(searchParams);
  const next = resolvedSearchParams.next || "/";

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-neutral-900 border border-neutral-800 rounded-lg">
      <h1 className="font-serif text-2xl text-amber-400 mb-6">Sign In</h1>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />

        <div>
          <label
            className="block text-sm text-neutral-400 mb-1"
            htmlFor="username"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-neutral-100 focus:outline-none focus:border-amber-400"
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label
            className="block text-sm text-neutral-400 mb-1"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-neutral-100 focus:outline-none focus:border-amber-400"
            placeholder="••••••••"
          />
        </div>

        {state?.error && (
          <p className="text-red-400 text-sm">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 bg-amber-500 text-neutral-950 font-bold rounded hover:bg-amber-400 transition-colors disabled:opacity-50"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* Demo Accounts */}
      <div className="mt-8 pt-6 border-t border-neutral-800">
        <h2 className="text-sm font-semibold text-neutral-300 mb-3">
          Demo Accounts
        </h2>
        <div className="space-y-2 text-sm">
          <DemoRow
            username="chef"
            role="Staff"
            password="kitchen2026"
          />
          <DemoRow
            username="Abebe"
            role="Customer A"
            password="demo2026"
          />
          <DemoRow
            username="Bekele"
            role="Customer B"
            password="bekele2026"
          />
        </div>
      </div>
    </div>
  );
}

function DemoRow({ username, role, password }) {
  return (
    <div className="flex justify-between items-center bg-neutral-950/50 p-2 rounded">
      <div>
        <span className="text-amber-400 font-medium">{username}</span>
        <span className="text-neutral-500 ml-2">({role})</span>
      </div>
      <code className="text-neutral-400">{password}</code>
    </div>
  );
}