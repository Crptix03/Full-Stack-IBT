"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default marker icons (bundler-safe paths).
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom amber pin for the courier.
const courierIcon = new L.DivIcon({
  className: "",
  html: `<div style="
    width: 22px; height: 22px;
    border-radius: 50%;
    background: #fbbf24;
    border: 3px solid #0a0a0a;
    box-shadow: 0 0 0 2px #fbbf24;
  "></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

// Fit the map view to all markers.
function FitBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [60, 60] });
  }, [map, points]);

  return null;
}

export default function DeliveryMap({
  restaurant,
  delivery,
  courier,
  address,
  status,
}) {
  const center = restaurant || [9.0054, 38.7636];
  const fitPoints = [restaurant, delivery, courier].filter(Boolean);

  // The route line: restaurant → customer.
  // Only rendered when both ends exist.
  const routeLine =
    restaurant && delivery ? [restaurant, delivery] : null;

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "320px", width: "100%", borderRadius: "12px" }}
      className="border border-neutral-800"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Route line — two polylines stacked:
          a dark outline behind, an amber stripe on top.
          The dark outline makes it readable against the busy
          street colours of the OSM tile layer. */}
      {routeLine && (
        <>
          <Polyline
            positions={routeLine}
            pathOptions={{
              color: "#0a0a0a",
              weight: 7,
              dashArray: "10, 10",
              opacity: 0.9,
            }}
          />
          <Polyline
            positions={routeLine}
            pathOptions={{
              color: "#fbbf24",
              weight: 3,
              dashArray: "10, 10",
              opacity: 1,
            }}
          />
        </>
      )}

      {/* Restaurant marker */}
      {restaurant && (
        <Marker position={restaurant}>
          <Popup>Addis Eats — Restaurant</Popup>
        </Marker>
      )}

      {/* Delivery address marker */}
      {delivery && (
        <Marker position={delivery}>
          <Popup>
            <div style={{ minWidth: 160 }}>
              <strong>Delivery address</strong>
              <br />
              {address || "Customer address"}
            </div>
          </Popup>
        </Marker>
      )}

      {/* Courier marker — moves as the order status changes */}
      {courier && (
        <Marker position={courier} icon={courierIcon}>
          <Popup>
            <div style={{ minWidth: 140 }}>
              <strong>Courier</strong>
              <br />
              Status: {status}
            </div>
          </Popup>
        </Marker>
      )}

      <FitBounds points={fitPoints} />
    </MapContainer>
  );
}