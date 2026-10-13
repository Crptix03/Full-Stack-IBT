import { NextResponse } from "next/server";
import { orderSchema } from "@/lib/schema";
import { addOrder, getOrdersFor } from "@/lib/orders";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

// ── GET: the current user's orders ────────────────────
// Polled by the orders list page. Never cached, always scoped
// to the session — never to a sent id.
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = getOrdersFor(session.userId);
  return NextResponse.json(orders);
}

// ── POST: create an order via the API ─────────────────
// Unused by the UI (the UI uses the placeOrder server action),
// but kept for completeness.
export async function POST(request) {
  const body = await request.json();
  const parsed = orderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const order = addOrder({ ...parsed.data, status: "pending" });
  return NextResponse.json(order, { status: 201 });
}