"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { orders, addOrder } from "@/lib/orders";
import { orderSchema } from "@/lib/schema";

// ── Place an order ──────────────────────────────────
export async function placeOrder(prevState, formData) {
  const raw = {
    customerName: formData.get("customerName"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    items: JSON.parse(formData.get("items") || "[]"),
  };

  const parsed = orderSchema.safeParse(raw);

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const order = addOrder({ ...parsed.data, status: "pending" });
  revalidatePath("/orders");
  redirect(`/checkout/success?id=${order.id}`);
}

// ── Cancel an order ─────────────────────────────────
export async function cancelOrder(orderId) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    return { error: "You must be signed in to cancel an order." };
  }

  const order = orders.find((o) => o.id === orderId);
  if (!order) {
    return { error: "Order not found." };
  }
  if (order.customerName !== session) {
    return { error: "You don't own this order." };
  }

  order.status = "cancelled";
  revalidatePath("/orders");
  return { success: true };
}