import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Sheggar Wheels — Peer-to-Peer Car Rental in Addis",
    template: "%s | Sheggar Wheels",
  },
  description:
    "Rent a car from a trusted local owner in Addis Ababa. No dealerships, no hidden fees — just cars owned by people in your city.",
  keywords: ["car rental", "Addis Ababa", "peer-to-peer", "Ethiopia", "rent a car"],
  authors: [{ name: "Sheggar Wheels" }],
  openGraph: {
    title: "Sheggar Wheels — Peer-to-Peer Car Rental in Addis",
    description:
      "Rent a car from a trusted local owner in Addis Ababa. No dealerships, no hidden fees.",
    url: "/",
    siteName: "Sheggar Wheels",
    locale: "en_US",
    type: "website",
    // images intentionally omitted — the root opengraph-image.jsx is the
    // fallback; car pages set their own image in generateMetadata.
  },
  twitter: {
    card: "summary_large_image",
    title: "Sheggar Wheels — Peer-to-Peer Car Rental in Addis",
    description:
      "Rent a car from a trusted local owner in Addis Ababa. No dealerships, no hidden fees.",
    // images intentionally omitted — the root fallback applies;
    // car pages override it in generateMetadata.
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col bg-white text-neutral-900">
        {children}
      </body>
    </html>
  );
}