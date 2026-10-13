import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getOrderById } from "@/lib/orders";
import LiveStatus from "./LiveStatus";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const order = getOrderById(id);
  return {
    title: order ? `Track Order #${id.slice(-6)}` : "Track Order",
    description: "Track your Addis Eats delivery in real time.",
  };
}

export default async function TrackPage({ params }) {
  const { id } = await params;

  // ── Layer 2: session + ownership (matches /orders/[id]) ──
  const session = await getSession();
  if (!session) {
    redirect(`/signin?next=/track/${id}`);
  }

  const order = getOrderById(id);
  if (!order) notFound();

  const isOwner = order.customerId === session.userId;
  const isStaff = session.role === "staff";
  if (!isOwner && !isStaff) notFound();

  // ── Render ──────────────────────────────────────────
  // The server passes a serialisable snapshot of the order to the
  // client. The client opens an SSE stream and keeps the status live.
  // No Date objects cross the boundary — everything is a string.

  const serialisableOrder = {
    id: order.id,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt ?? order.createdAt,
    address: order.address,
    customerName: order.customerName,
    phone: order.phone,
    items: order.items ?? [],
    total: order.total ?? 0,
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link
          href="/orders"
          className="text-amber-400 text-sm hover:underline inline-flex items-center gap-1"
        >
          ← Back to Orders
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="font-serif text-3xl text-amber-400 mb-2">
          Track Order #{id.slice(-6)}
        </h1>
        <p className="text-neutral-400 text-sm">
          Live updates appear here without a refresh.
        </p>
      </div>

      <LiveStatus order={serialisableOrder} />
    </div>
  );
}