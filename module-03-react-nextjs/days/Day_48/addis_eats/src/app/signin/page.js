"use client";

import { useActionState, use, useState, useTransition } from "react";
import { signIn as nextAuthSignIn } from "next-auth/react";
import { signIn } from "@/app/actions";

export default function SignInPage({ searchParams }) {
  const [state, formAction, isPending] = useActionState(signIn, null);
  const [isGoogleLoading, startGoogleTransition] = useTransition();

  const resolvedSearchParams = use(searchParams);
  const next = resolvedSearchParams.next || "/";

  const handleGoogleSignIn = () => {
    startGoogleTransition(async () => {
      // Triggers the real Google OAuth flow.
      // The callbackUrl is where NextAuth sends the user after success.
      await nextAuthSignIn("google", { callbackUrl: next });
    });
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-neutral-900 border border-neutral-800 rounded-lg">
      <h1 className="font-serif text-2xl text-amber-400 mb-6">Sign In</h1>

      {/* ── Continue with Google ───────────────────────── */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-neutral-900 font-medium rounded hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 transition-colors disabled:opacity-60 min-h-[44px]"
      >
        <GoogleIcon />
        {isGoogleLoading ? "Redirecting to Google…" : "Continue with Google"}
      </button>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-neutral-800" />
        <span className="text-xs text-neutral-500">or</span>
        <div className="flex-1 h-px bg-neutral-800" />
      </div>

      {/* ── Username / password form (demo accounts) ───── */}
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
          className="w-full py-2 bg-amber-500 text-neutral-950 font-bold rounded hover:bg-amber-400 transition-colors disabled:opacity-50 min-h-[44px]"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* ── Demo Accounts ──────────────────────────────── */}
      <div className="mt-8 pt-6 border-t border-neutral-800">
        <h2 className="text-sm font-semibold text-neutral-300 mb-3">
          Demo Accounts
        </h2>
        <div className="space-y-2 text-sm">
          <DemoRow username="chef" role="Staff" password="kitchen2026" />
          <DemoRow username="Abebe" role="Customer A" password="demo2026" />
          <DemoRow username="Bekele" role="Customer B" password="Bekele2026" />
          <DemoRow username="Sara" role="Customer C" password="sara2026" />
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

// The official Google "G" logo — four-colour version.
function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7963 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.859-3.0477.859-2.344 0-4.3282-1.5831-5.036-3.7104H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71c-.18-.54-.2822-1.1168-.2822-1.71s.1023-1.17.2822-1.71V4.9582H.9574C.3477 6.1732 0 7.5478 0 9s.3477 2.8268.9574 4.0418L3.964 10.71z"
      />
      <path
        fill="#EA4335"
        d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.4259 0 9 0 5.4818 0 2.4382 2.0168.9574 4.9582L3.964 7.29C4.6718 5.1627 6.6559 3.5795 9 3.5795z"
      />
    </svg>
  );
}