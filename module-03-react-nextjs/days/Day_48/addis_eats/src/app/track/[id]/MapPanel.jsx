"use client";

import dynamic from "next/dynamic";

// Leaflet touches `window` the moment it is imported.
// If we import it normally in a component that runs on the server,
// the build crashes. `ssr: false` tells Next.js:
//   "never render this on the server — only in the browser."
//
// The `loading` placeholder matches the map's height, otherwise the
// page jumps when the map arrives (the same CLS problem as an
// unsized image).

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