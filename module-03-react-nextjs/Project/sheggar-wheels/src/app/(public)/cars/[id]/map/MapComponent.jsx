"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Helper component to force the map to center on the given coordinates
function RecenterMap({ lat, lng }) {
  const map = useMap();
  
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 14);
    }
  }, [lat, lng, map]);

  return null;
}

export default function MapComponent({ lat, lng, name }) {
  // Default to Addis Ababa center if coords are missing
  const center = [lat || 9.0054, lng || 38.7636];

  return (
    <MapContainer 
      center={center} 
      zoom={14} 
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Force recenter when props change */}
      <RecenterMap lat={lat} lng={lng} />

      <Marker position={center}>
        <Popup>{name}</Popup>
      </Marker>
    </MapContainer>
  );
}