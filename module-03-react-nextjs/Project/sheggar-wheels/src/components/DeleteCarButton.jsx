"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCarAction } from "@/app/actions";
import { Trash2 } from "lucide-react";

export default function DeleteCarButton({ carId }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Delete this car listing permanently?")) return;
    startTransition(async () => {
      await deleteCarAction(carId);
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="px-3 py-2 border border-neutral-200 rounded-xl text-neutral-600 hover:border-red-300 hover:text-red-600 disabled:opacity-50 transition-colors"
      aria-label="Delete car"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
