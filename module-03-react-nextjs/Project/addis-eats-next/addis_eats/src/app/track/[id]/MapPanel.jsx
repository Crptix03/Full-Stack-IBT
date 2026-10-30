"use client";

import dynamic from "next/dynamic";


const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[320px] w-full rounded-xl border border-neutral-800 bg-neutral-900/40 flex items-center justify-center">
      <p className="text-neutral-500 text-sm">Loading map…</p>

    </div>

  ),
});

export default function MapPanel(props) {
  return <DeliveryMap {...props} />;
}