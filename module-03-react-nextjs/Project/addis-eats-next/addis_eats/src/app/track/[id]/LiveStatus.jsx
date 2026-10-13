"use client";

import { useEffect, useRef, useState } from "react";
import { etb, when, relative } from "@/lib/format";
import {
  RESTAURANT,
  coordsForAddress,
  courierPosition,
  statusLabel,
} from "@/lib/coordinates";
import MapPanel from "./MapPanel";
import CancelOrderButton from "../../orders/CancelOrderButton";

export default function LiveStatus({ order }) {
  const [status, setStatus] = useState(order.status);
  const [updatedAt, setUpdatedAt] = useState(order.updatedAt ?? order.createdAt);
  const [connection, setConnection] = useState("connecting");
  const esRef = useRef(null);

  useEffect(() => {
    const es = new EventSource(`/api/orders/${order.id}/stream`);
    esRef.current = es;

    let lastMessageAt = Date.now();

    es.onopen = () => {
      setConnection("live");
    };

    es.onmessage = (e) => {
      lastMessageAt = Date.now();
      setConnection("live");
      try {
        const payload = JSON.parse(e.data);
        if (payload.status) setStatus(payload.status);
        if (payload.updatedAt) setUpdatedAt(payload.updatedAt);

        if (
          payload.status === "delivered" ||
          payload.status === "cancelled"
        ) {
          es.close();
          setConnection("closed");
        }
      } catch {
        // Malformed message — ignore.
      }
    };

    es.onerror = () => {
      const silenceMs = Date.now() - lastMessageAt;
      if (silenceMs > 3000) {
        setConnection("reconnecting");
      }
    };

    return () => {
      es.close();
    };
  }, [order.id]);

  const delivery = coordsForAddress(order.address);
  const courier = courierPosition(status, delivery);
  const canCancel = status === "pending" || status === "preparing";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <MapPanel
          restaurant={RESTAURANT}
          delivery={delivery}
          courier={courier}
          address={order.address}
          status={status}
        />
      </div>

      <div className="flex flex-col gap-6">
        <StatusHeader
          status={status}
          connection={connection}
          updatedAt={updatedAt}
        />

        <AddressBlock address={order.address} />
        <SummaryBlock order={order} />
        <CourierNote status={status} />

        {canCancel && (
          <div className="pt-2">
            <CancelOrderButton orderId={order.id} />
          </div>
        )}
      </div>
    </div>
  );
}

function StatusHeader({ status, connection, updatedAt }) {
  const statusStyle =
    status === "pending"
      ? "bg-amber-900 text-amber-400"
      : status === "preparing"
      ? "bg-blue-900/50 text-blue-300"
      : status === "on_the_way"
      ? "bg-purple-900/50 text-purple-300"
      : status === "delivered"
      ? "bg-green-900/50 text-green-400"
      : status === "cancelled"
      ? "bg-red-900/50 text-red-400"
      : "bg-neutral-800 text-neutral-400";

  return (
    <div>
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <span className={`text-xs font-bold px-3 py-1 rounded ${statusStyle}`}>
          {status.toUpperCase().replace("_", " ")}
        </span>
        <ConnectionIndicator state={connection} />
      </div>

      <h2 className="font-serif text-2xl text-neutral-100 mb-1">
        {statusLabel(status)}
      </h2>

      <p className="text-xs text-neutral-500">
        Updated {relative(updatedAt)} · {when.format(new Date(updatedAt))}
      </p>
    </div>
  );
}

function ConnectionIndicator({ state }) {
  const config = {
    live: { dot: "bg-green-500", label: "Live", pulse: true },
    connecting: { dot: "bg-amber-500", label: "Connecting", pulse: true },
    reconnecting: { dot: "bg-amber-500", label: "Reconnecting", pulse: true },
    closed: { dot: "bg-neutral-500", label: "Closed", pulse: false },
  }[state] ?? { dot: "bg-neutral-500", label: "Unknown", pulse: false };

  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-neutral-500">
      <span className="relative flex h-2 w-2">
        {config.pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.dot} opacity-75`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
      </span>
      {config.label}
    </span>
  );
}

function AddressBlock({ address }) {
  return (
    <div className="border border-neutral-800 rounded-xl p-5 bg-neutral-900/30">
      <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
        Delivery address
      </h3>
      <p className="text-neutral-100">{address || "Not provided"}</p>
    </div>
  );
}

function SummaryBlock({ order }) {
  return (
    <div className="border border-neutral-800 rounded-xl p-5 bg-neutral-900/30">
      <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-3">
        Order summary
      </h3>

      <ul className="space-y-2 mb-4">
        {order.items?.map((item) => (
          <li key={item.id} className="flex justify-between text-sm text-neutral-400">
            <span>
              {item.qty}× {item.name}
            </span>
            <span className="tabular-nums">
              {etb.format(item.price * item.qty)}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-baseline pt-3 border-t border-neutral-800">
        <span className="text-neutral-400 text-sm">Total</span>
        <span className="font-serif text-xl text-amber-400">
          {etb.format(order.total ?? 0)}
        </span>
      </div>
    </div>
  );
}

function CourierNote({ status }) {
  const message =
    status === "pending"
      ? "Your order is at the restaurant. Preparation will start shortly."
      : status === "preparing"
      ? "The kitchen is preparing your food."
      : status === "on_the_way"
      ? "The courier has picked up your order and is on the way."
      : status === "delivered"
      ? "Your order has been delivered. Enjoy!"
      : status === "cancelled"
      ? "This order was cancelled."
      : "";

  if (!message) return null;

  return <div className="text-xs text-neutral-500 italic">{message}</div>;
}