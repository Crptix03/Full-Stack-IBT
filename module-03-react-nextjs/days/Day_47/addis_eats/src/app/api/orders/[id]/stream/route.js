import { getOrderById } from "@/lib/orders";
import { getSession } from "@/lib/session";

// Server-Sent Events stream for a single order's status.
//
// The format is strict: each message is
//     data: <payload>\n\n
// with TWO newlines. One newline and the browser waits forever.
//
// The stream stays open until the client disconnects, the order is
// delivered, or the server closes it.

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { id } = await params;

  // ── Layer 3: session + ownership at the API boundary ──
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

  // ── SSE stream ────────────────────────────────────────
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
          // Stream was closed by the client mid-send.
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
          // Already closed.
        }
      };

      const tick = () => {
        const current = getOrderById(id);

        // Order vanished? Close cleanly.
        if (!current) {
          cleanup();
          return;
        }

        // Only send when something actually changed.
        const signature = `${current.status}|${current.updatedAt ?? ""}`;
        if (signature !== lastSent) {
          lastSent = signature;
          send({
            id: current.id,
            status: current.status,
            updatedAt: current.updatedAt ?? current.createdAt,
          });
        }

        // Terminal state → close the stream deliberately.
        if (current.status === "delivered" || current.status === "cancelled") {
          // Give the client a moment to receive the final message,
          // then close.
          setTimeout(cleanup, 500);
        }
      };

      // Send the current state immediately on connect.
      tick();

      // Then poll internally every 2 seconds and push any change.
      intervalId = setInterval(tick, 2000);

      // If the client disconnects, stop the interval.
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