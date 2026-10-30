import { getOrderById } from "@/lib/orders";
import { getSession } from "@/lib/session";


export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { id } = await params;

  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const order = getOrderById(id);
  if (!order) {
    return new Response("Not found", { status: 404 });
  }

  const isOwner = order.customerId === session.userId;
  const isStaff = session.role === "staff";
  if (!isOwner && !isStaff) {
    return new Response("Forbidden", { status: 403 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let lastSent = null;
      let intervalId = null;
      let closed = false;

      const send = (data) => {
        if (closed) return;
        const payload = `data: ${JSON.stringify(data)}\n\n`;
        try {
          controller.enqueue(encoder.encode(payload));
        } catch {
          cleanup();
        }
      };

      const cleanup = () => {
        if (closed) return;
        closed = true;
        if (intervalId) clearInterval(intervalId);
        try {
          controller.close();
        } catch {
        }
      };

      const tick = () => {
        const current = getOrderById(id);

        if (!current) {
          cleanup();
          return;
        }

        const signature = `${current.status}|${current.updatedAt ?? ""}`;
        if (signature !== lastSent) {
          lastSent = signature;
          send({
            id: current.id,
            status: current.status,
            updatedAt: current.updatedAt ?? current.createdAt,
          });
        }

        if (current.status === "delivered" || current.status === "cancelled") {
          setTimeout(cleanup, 500);
        }
      };

      tick();

      intervalId = setInterval(tick, 2000);

      request.signal.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}