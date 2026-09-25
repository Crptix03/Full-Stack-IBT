"use client";

import { useActionState } from "react";
import { placeOrder } from "@/app/actions";

export default function CheckoutPage() {
  const [state, formAction, isPending] = useActionState(placeOrder, null);

  return (
    <form action={formAction}>
      <input name="customerName" />
      {state?.fieldErrors?.customerName && (
        <p className="text-red-500">{state.fieldErrors.customerName[0]}</p>
      )}
      {/* ...other fields... */}

      <button disabled={isPending}>
        {isPending ? "Placing order…" : "Place order"}
      </button>
    </form>
  );
}