import { notFound, redirect } from "next/navigation";
import OrderStatusClient from "./OrderStatusClient";
import { orders } from "@/lib/orders";
import { getSession } from "@/lib/session";

export default async function OrderPage({ params }) {
  const { id } = await params;
  
  // 1. Get the current session
  const session = await getSession();
  
  if (!session) {
    redirect(`/signin?next=/orders/${id}`);
  }

  // 2. Find the order
  const order = orders.find((o) => o.id === id);

  if (!order) notFound();

  // 3. OWNERSHIP CHECK
  // Your actions.js uses `order.customerId`, so we match that here.
  const isOwner = order.customerId === session.userId;
  const isStaff = session.role === "staff";

  if (!isOwner && !isStaff) {
    // If they don't own it and aren't staff, return 404
    notFound(); 
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl text-amber-400 mb-4">
        Order #{id.slice(-6)}
      </h1>
      <OrderStatusClient id={id} initialData={order} />
    </div>
  );
}