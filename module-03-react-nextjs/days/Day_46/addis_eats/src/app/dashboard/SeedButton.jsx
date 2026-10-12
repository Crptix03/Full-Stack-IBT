"use client";

import { useTransition } from "react";
import { seedOrdersAction, clearSeedOrdersAction } from "@/app/actions";

export default function SeedButton() {
  const [isSeeding, startSeed] = useTransition();
  const [isClearing, startClear] = useTransition();

  const handleSeed = () => {
    startSeed(async () => {
      await seedOrdersAction();
    });
  };

  const handleClear = () => {
    startClear(async () => {
      await clearSeedOrdersAction();
    });
  };

  const busy = isSeeding || isClearing;

  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        type="button"
        onClick={handleSeed}
        disabled={busy}
        className="px-4 py-2 text-xs font-semibold border border-neutral-700 text-neutral-300 rounded-lg hover:border-amber-400 hover:text-amber-400 disabled:opacity-50 transition-colors"
      >
        {isSeeding ? "Seeding…" : "Seed demo orders"}
      </button>

      <button
        type="button"
        onClick={handleClear}
        disabled={busy}
        className="px-4 py-2 text-xs font-semibold border border-neutral-700 text-neutral-400 rounded-lg hover:border-red-400 hover:text-red-400 disabled:opacity-50 transition-colors"
      >
        {isClearing ? "Clearing…" : "Clear demo orders"}
      </button>
    </div>
  );
}