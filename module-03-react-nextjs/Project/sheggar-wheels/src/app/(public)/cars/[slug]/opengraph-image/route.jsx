import { ImageResponse } from "next/og";
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { db } from "@/lib/db";
import { etb } from "@/lib/format";
import { findCarBySlug } from "@/lib/slug";

const size = { width: 1200, height: 630 };

async function loadPhoto(src) {
  if (/^https?:\/\//.test(src)) {
    const res = await fetch(src);
    if (!res.ok) throw new Error(`Photo fetch failed: ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  }
  try {
    return await readFile(path.join(process.cwd(), "public", src));
  } catch {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}${src}`);
    if (!res.ok) throw new Error(`Photo fetch failed: ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  }
}

export async function GET(request, { params }) {
  const { slug } = await params;
  const car = findCarBySlug(db.cars, slug);

  if (!car || car.status !== "approved") {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1e1b4b", color: "#a5b4fc", fontSize: 48, fontFamily: "sans-serif" }}>
          Car not found
        </div>
      ),
      size
    );
  }

  let imageDataUrl = null;
  try {
    const buffer = await loadPhoto(car.photos[0]);
    // Keep the PNG small — Satori breaks with large base64 payloads.
    // 800×500 is plenty for a background; objectFit: "cover" fills the rest.
    const png = await sharp(buffer)
      .resize(800, 500, { fit: "cover", position: car.photoPosition === "center 80%" ? "bottom" : "centre" })
      .png({ quality: 80 })
      .toBuffer();
    imageDataUrl = `data:image/png;base64,${png.toString("base64")}`;
  } catch (err) {
    console.error("OG photo failed:", err);
  }

  const transmission =
    car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1);

  return new ImageResponse(
    (
      // Root — must be flex
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", backgroundColor: "#1e1b4b", fontFamily: "sans-serif" }}>

        {/* Background photo */}
        {imageDataUrl && (
          <img src={imageDataUrl} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        )}

        {/* Gradient + all text — single flex child of root */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.1) 100%)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 56 }}>

          {/* Top row */}
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

            {/* Brand badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 100, padding: "8px 20px", color: "rgba(255,255,255,0.9)", fontSize: 18, fontWeight: 700 }}>
              <span>🛞</span>
              <span>Sheggar Wheels</span>
            </div>

            {/* Neighbourhood badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(249,115,22,0.25)", border: "1px solid rgba(249,115,22,0.5)", borderRadius: 100, padding: "8px 20px", color: "#fb923c", fontSize: 18, fontWeight: 600 }}>
              <span>📍</span>
              <span>{car.neighbourhood}</span>
            </div>
          </div>

          {/* Bottom content */}
          <div style={{ display: "flex", flexDirection: "column" }}>

            {/* Car name */}
            <div style={{ display: "flex", color: "#ffffff", fontSize: 76, fontWeight: 900, letterSpacing: -2, lineHeight: 1, marginBottom: 16 }}>
              {car.make} {car.model}
            </div>

            {/* Specs row */}
            <div style={{ display: "flex", flexDirection: "row", gap: 16, marginBottom: 24, color: "rgba(255,255,255,0.75)", fontSize: 24 }}>
              <span>{car.year}</span>
              <span>·</span>
              <span>{transmission}</span>
              <span>·</span>
              <span>{car.seats} seats</span>
            </div>

            {/* Price */}
            <div style={{ display: "flex", flexDirection: "row", alignItems: "baseline", gap: 10 }}>
              <span style={{ color: "#f97316", fontSize: 52, fontWeight: 900 }}>
                {etb.format(car.pricePerDay)}
              </span>
              <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 24 }}>
                per day
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
