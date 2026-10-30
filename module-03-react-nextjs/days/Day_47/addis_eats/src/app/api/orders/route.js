import { NextResponse } from "next/server";
import { orderSchema } from "@/lib/schema";
import { addOrder, getOrdersFor } from "@/lib/orders";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = getOrdersFor(session.userId);
  return NextResponse.json(orders);
}

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