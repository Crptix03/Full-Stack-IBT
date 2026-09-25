import { NextResponse } from "next/server";
import { orderSchema } from "@/lib/schema";
import { addOrder } from "@/lib/orders";

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