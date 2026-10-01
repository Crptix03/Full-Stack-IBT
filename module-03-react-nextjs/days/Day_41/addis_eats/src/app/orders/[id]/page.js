import { notFound } from "next/navigation";
import OrderStatusClient from "./OrderStatusClient";
import { orders } from "@/lib/orders";

export default async function OrderPage({ params }) {
  const { id } = await params;
  const order = orders.find((o) => o.id === id);

  if (!order) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl text-amber-400 mb-4">
        Order #{id.slice(-6)}
      </h1>
      <OrderStatusClient id={id} initialData={order} />
    </div>
  );
}