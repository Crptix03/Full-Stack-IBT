import { ImageResponse } from "next/og";
import sharp from "sharp";
import { getDishes } from "@/lib/dishes";
import { toSlug } from "../slug";

export const alt = "Dish image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { slug } = await params;
  const dishes = await getDishes();
  const dish = dishes.find((d) => toSlug(d.name) === slug);

  if (!dish) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0a0a0a",
            color: "#fbbf24",
            fontSize: 48,
          }}
        >
          Dish not found
        </div>
      ),
      size
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Fetch the image and convert to a PNG data URL.
  // Satori (ImageResponse) does not decode WebP — sharp handles that.
  let imageDataUrl = null;
  try {
    const res = await fetch(`${baseUrl}${dish.image}`);
    if (res.ok) {
      const buffer = Buffer.from(await res.arrayBuffer());
      const png = await sharp(buffer).png().toBuffer();
      imageDataUrl = `data:image/png;base64,${png.toString("base64")}`;
    }
  } catch (err) {
    // fall through to a solid background if the fetch fails
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#0a0a0a",
        }}
      >
        {imageDataUrl && (
          <img
            src={imageDataUrl}
            alt={dish.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 60%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: 60,
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontWeight: "bold",
              color: "#fbbf24",
              margin: 0,
              fontFamily: "serif",
            }}
          >
            {dish.name}
          </h1>
          <p
            style={{
              fontSize: 36,
              color: "#ffffff",
              margin: "10px 0 0",
            }}
          >
            {dish.price} Birr — Addis Eats
          </p>
        </div>
      </div>
    ),
    size
  );
}