"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { orders, addOrder } from "@/lib/orders";
import { orderSchema } from "@/lib/schema";
import { findUserByUsername, findUserById } from "@/lib/users";
import { createSession, destroySession, getSession } from "@/lib/session";

// ── Sign In ──────────────────────────────────────────
export async function signIn(prevState, formData) {
  const username = (formData.get("username") || "").trim();
  const password = formData.get("password") || "";
  const next = formData.get("next") || "/";

  if (!username || !password) {
    return { error: "Please fill in both fields." };
  }

  const user = findUserByUsername(username);

  // ⚠️ Plaintext comparison — demo only
  if (!user || user.password !== password) {
    return { error: "Incorrect username or password." };
  }

  await createSession(user.id, user.role);

  // ── Safe redirect ────────────────────────────────────
  // Only allow relative paths that start with a single slash.
  // Prevents open redirect attacks like ?next=https://evil.com
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";

  redirect(safeNext);
}

// ── Sign Out ─────────────────────────────────────────
export async function signOut() {
  await destroySession();
  revalidatePath("/");
  redirect("/");
}

// ── Place an order ───────────────────────────────────
export async function placeOrder(prevState, formData) {
  // Layer 3: re-check the session inside the write
  const session = await getSession();
  if (!session) {
    return { error: "You must be signed in to place an order." };
  }

  const user = findUserById(session.userId);
  if (!user) {
    return { error: "Your session is invalid. Please sign in again." };
  }

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

  const order = addOrder({
    ...parsed.data,
    customerId: user.id,
    status: "pending",
  });

  revalidatePath("/orders");
  redirect(`/checkout/success?id=${order.id}`);
}

// ── Cancel an order ──────────────────────────────────
export async function cancelOrder(orderId) {
  // Layer 3: re-check session
  const session = await getSession();
  if (!session) {
    return { error: "You must be signed in to cancel an order." };
  }

  const order = orders.find((o) => o.id === orderId);
  if (!order) {
    return { error: "Order not found." };
  }

  // Ownership check — only the owner or staff can cancel
  const isOwner = order.customerId === session.userId;
  const isStaff = session.role === "staff";

  if (!isOwner && !isStaff) {
    return { error: "You don't own this order." };
  }

  order.status = "cancelled";
  revalidatePath("/orders");
  return { success: true };
}