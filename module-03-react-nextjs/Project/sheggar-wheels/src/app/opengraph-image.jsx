import { ImageResponse } from "next/og";

export const alt = "Sheggar Wheels — Peer-to-Peer Car Rental in Addis";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Site-wide OG image — shown when sharing the home page or any page
// that doesn't have its own opengraph-image.jsx.
// Pure CSS/text — no image fetching needed.
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "64px",
          background: "linear-gradient(135deg, #4338ca 0%, #3730a3 50%, #1e1b4b 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", top: "40px", right: "160px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

        {/* Car emoji top-right */}
        <div style={{ position: "absolute", top: "48px", right: "64px", width: "160px", height: "160px", borderRadius: "32px", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "80px" }}>
          🚗
        </div>

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
            🛞
          </div>
          <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "24px", fontWeight: "700" }}>
            Sheggar Wheels
          </span>
        </div>

        {/* Headline */}
        <div style={{ color: "#ffffff", fontSize: "64px", fontWeight: "900", lineHeight: 1.05, letterSpacing: "-2px", marginBottom: "20px", maxWidth: "800px" }}>
          Rent a car from a local owner in Addis.
        </div>

        {/* Subtext */}
        <div style={{ color: "rgba(199,210,254,0.9)", fontSize: "24px", fontWeight: "500", marginBottom: "40px", maxWidth: "700px" }}>
          No dealerships. No hidden fees. Just cars owned by people in your city.
        </div>

        {/* Badges */}
        <div style={{ display: "flex", gap: "12px" }}>
          {["Peer-to-Peer", "Addis Ababa", "Instant Booking"].map((tag) => (
            <div key={tag} style={{ padding: "8px 20px", borderRadius: "100px", background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.9)", fontSize: "16px", fontWeight: "600", border: "1px solid rgba(255,255,255,0.2)" }}>
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
