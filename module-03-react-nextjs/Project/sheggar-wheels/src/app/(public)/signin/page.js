"use client";

import { useActionState, use } from "react";
import Link from "next/link";
import { signIn } from "@/app/actions";

export default function SignInPage({ searchParams }) {
  const [state, formAction, isPending] = useActionState(signIn, null);

  // Unwrap searchParams in Next 15/16
  const resolvedSearchParams = use(searchParams);
  const next = resolvedSearchParams.next || "/";

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-neutral-200 rounded-2xl p-8">
        <h1 className="text-2xl font-black mb-1">Sign In</h1>
        <p className="text-sm text-neutral-500 mb-6">
          Use a demo account to explore the platform.
        </p>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="next" value={next} />

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">
              Username
            </label>
            <input
              name="username"
              type="text"
              required
              placeholder="Enter your username"
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {state?.error && (
            <p className="text-red-600 text-sm">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-200">
          <h2 className="text-sm font-semibold text-neutral-700 mb-3">
            Demo Accounts
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between bg-neutral-50 p-2 rounded-lg">
              <span className="font-medium text-neutral-700">dawit</span>
              <code className="text-neutral-500">dawit2026 (owner)</code>
            </div>
            <div className="flex justify-between bg-neutral-50 p-2 rounded-lg">
              <span className="font-medium text-neutral-700">hanna</span>
              <code className="text-neutral-500">hanna2026 (owner)</code>
            </div>
            <div className="flex justify-between bg-neutral-50 p-2 rounded-lg">
              <span className="font-medium text-neutral-700">yohannes</span>
              <code className="text-neutral-500">yohannes2026 (renter)</code>
            </div>
            <div className="flex justify-between bg-neutral-50 p-2 rounded-lg">
              <span className="font-medium text-neutral-700">admin</span>
              <code className="text-neutral-500">admin2026 (admin)</code>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-neutral-600 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-indigo-600 hover:underline font-semibold">
            Sign up as a renter
          </Link>
        </p>
      </div>
    </div>
  );
}