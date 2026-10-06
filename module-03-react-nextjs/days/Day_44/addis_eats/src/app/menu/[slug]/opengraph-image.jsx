import { ImageResponse } from "next/og";
import { getDishes } from "@/lib/dishes";
import { toSlug } from "../slug";

export const alt = "Dish Image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { slug } = await params;
  const dishes = await getDishes();
  const dish = dishes.find((d) => toSlug(d.name) === slug);

  if (!dish) {
    return new ImageResponse(<div>Not Found</div>, size);
  }

  // Build absolute URL for the image
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const imageUrl = `${baseUrl}${dish.image}`;

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
        {/* Dish Image Background */}
        <img
          src={imageUrl}
          alt={dish.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 60%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "60px",
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