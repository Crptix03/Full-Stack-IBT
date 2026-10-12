import { notFound, redirect } from "next/navigation";
import OrderStatusClient from "./OrderStatusClient";
import { getOrderById } from "@/lib/orders";
import { getSession } from "@/lib/session";

export default async function OrderPage({ params }) {
  const { id } = await params;

  const session = await getSession();
  if (!session) {
    redirect(`/signin?next=/orders/${id}`);
  }

  const order = getOrderById(id);
  if (!order) notFound();

  const isOwner = order.customerId === session.userId;
  const isStaff = session.role === "staff";

  if (!isOwner && !isStaff) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl text-amber-400 mb-4">
        Order #{id.slice(-6)}
      </h1>
      <OrderStatusClient id={id} initialData={order} />
    </div>
  );
}