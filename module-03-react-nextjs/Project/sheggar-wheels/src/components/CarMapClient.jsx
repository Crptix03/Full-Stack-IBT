"use client";

import dynamic from "next/dynamic";

// Leaflet requires the DOM — load with no SSR.
const MapComponent = dynamic(
  () => import("@/app/(public)/cars/[id]/map/MapComponent"),
  { ssr: false, loading: () => <div className="w-full h-96 bg-neutral-100 rounded-2xl animate-pulse" /> }
);

export default function CarMapClient({ lat, lng, label }) {
  return (
    <div className="w-full h-96 rounded-2xl overflow-hidden border border-neutral-200">
      <MapComponent lat={lat} lng={lng} name={label} />
    </div>
  );
}
