"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp } from "@/app/actions";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUp, null);

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="mb-6">
        <Link href="/signin" className="text-indigo-600 text-sm hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl p-8">
        <h1 className="text-2xl font-black mb-1">Create Account</h1>
        <p className="text-sm text-neutral-500 mb-6">Sign up as a renter to book cars.</p>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">
              Full name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="Abebe Bekele"
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">Phone (optional)</label>
            <input
              name="phone"
              type="tel"
              placeholder="+251 911 000 000"
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</> : "Create Renter Account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-neutral-600 text-center">
          Already have an account?{" "}
          <Link href="/signin" className="text-indigo-600 hover:underline font-semibold">Sign in</Link>
        </p>
        <p className="mt-4 text-[10px] text-neutral-400 text-center">
          ⚠️ Demo only. Passwords stored in plaintext. Not production-ready.
        </p>
      </div>
    </div>
  );
}
