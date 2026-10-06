"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { orders, addOrder, updateOrderStatus } from "@/lib/orders";
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

  const safeNext =
    next.startsWith("/") && !next.startsWith("//") ? next : "/";

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
    notes: formData.get("notes") || "",
    items: JSON.parse(formData.get("items") || "[]"),
  };

  const parsed = orderSchema.safeParse(raw);

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const total = parsed.data.items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const order = addOrder({
    ...parsed.data,
    customerId: user.id,
    status: "pending",
    total,
  });

  revalidatePath("/orders");
  redirect(`/checkout/success?id=${order.id}`);
}

// ── Cancel an order ──────────────────────────────────
export async function cancelOrder(orderId) {
  const session = await getSession();
  if (!session) {
    return { error: "You must be signed in to cancel an order." };
  }

  const order = orders.find((o) => o.id === orderId);
  if (!order) {
    return { error: "Order not found." };
  }

  const isOwner = order.customerId === session.userId;
  const isStaff = session.role === "staff";

  if (!isOwner && !isStaff) {
    return { error: "You don't own this order." };
  }

  order.status = "cancelled";
  revalidatePath("/orders");
  return { success: true };
}

// ── Update order status (staff only) ─────────────────
export async function updateOrderStatusAction(orderId, newStatus) {
  // Layer 3: re-check the session AND the role inside the write
  const session = await getSession();
  if (!session) {
    return { error: "You must be signed in." };
  }

  // Only staff can change status. This is the role check that must
  // exist server-side, not just in the markup.
  if (session.role !== "staff") {
    return { error: "Only staff can update order status." };
  }

  const validStatuses = ["pending", "preparing", "delivered", "cancelled"];
  if (!validStatuses.includes(newStatus)) {
    return { error: "Invalid status." };
  }

  const updated = updateOrderStatus(orderId, newStatus);
  if (!updated) {
    return { error: "Order not found." };
  }

  // Refresh both the kitchen dashboard and any order pages
  revalidatePath("/kitchen");
  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);

  return { success: true, status: newStatus };
}