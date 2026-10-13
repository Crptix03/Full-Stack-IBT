"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  orders,
  addOrder,
  updateOrderStatus,
  seedDemoOrders,
  clearSeedOrders,
} from "@/lib/orders";
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

  // Plaintext comparison — demo only
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
  const session = await getSession();
  if (!session) {
    return { error: "You must be signed in." };
  }

  if (session.role !== "staff") {
    return { error: "Only staff can update order status." };
  }

  const validStatuses = [
  "pending",
  "preparing",
  "on_the_way",
  "delivered",
  "cancelled",
];
  if (!validStatuses.includes(newStatus)) {
    return { error: "Invalid status." };
  }

  const updated = updateOrderStatus(orderId, newStatus);
  if (!updated) {
    return { error: "Order not found." };
  }

  revalidatePath("/kitchen");
  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/dashboard");

  return { success: true, status: newStatus };
}

// ── Seed demo orders (staff only) ────────────────────
export async function seedOrdersAction() {
  const session = await getSession();
  if (!session || session.role !== "staff") {
    return { error: "Only staff can seed demo data." };
  }

  const count = seedDemoOrders();

  revalidatePath("/dashboard");
  revalidatePath("/orders");
  revalidatePath("/kitchen");

  return { success: true, total: count };
}

// ── Clear seed orders (staff only) ───────────────────
export async function clearSeedOrdersAction() {
  const session = await getSession();
  if (!session || session.role !== "staff") {
    return { error: "Only staff can clear demo data." };
  }

  const count = clearSeedOrders();

  revalidatePath("/dashboard");
  revalidatePath("/orders");
  revalidatePath("/kitchen");

  return { success: true, removed: count };
}