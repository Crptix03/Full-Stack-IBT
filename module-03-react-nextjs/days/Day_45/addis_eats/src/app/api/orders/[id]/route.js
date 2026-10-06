import { NextResponse } from "next/server";
import { getOrderById } from "@/lib/orders";
import { getSession } from "@/lib/session";

export async function GET(request, { params }) {
  const { id } = await params;

  // Layer 3: the API route itself checks the session.
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const isOwner = order.customerId === session.userId;
  const isStaff = session.role === "staff";

  if (!isOwner && !isStaff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(order);
}