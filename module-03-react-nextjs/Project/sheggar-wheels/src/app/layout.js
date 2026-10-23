import { Jost, Playfair_Display } from "next/font/google";
import "./globals.css";
import SeedInitializer from "./SeedInitializer";


const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-jost",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata = {
  title: {
    default: "Sheggar Wheels — Peer-to-Peer Car Rental",
    template: "%s | Sheggar Wheels",
  },
  description:
    "Rent a car from a trusted local owner in Addis Ababa. Peer-to-peer car rental, no dealerships.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${jost.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
        <SeedInitializer />
        {children}
      </body>
    </html>
  );
}