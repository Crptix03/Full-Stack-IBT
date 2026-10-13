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
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <h1 className="font-serif text-3xl text-amber-400">
          Order #{id.slice(-6)}
        </h1>
        <Link
          href={`/track/${id}`}
          className="px-4 py-2 text-xs font-semibold bg-amber-400 text-neutral-900 rounded-lg hover:bg-amber-300 transition-colors inline-flex items-center gap-1"
        >
          Track live →
        </Link>
      </div>
      <OrderStatusClient id={id} initialData={order} />
    </div>
  );
}