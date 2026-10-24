import { Inter } from "next/font/google";
import "./globals.css";
import SeedInitializer from "./SeedInitializer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: {
    default: "Sheggar Wheels — Peer-to-Peer Car Rental in Addis",
    template: "%s | Sheggar Wheels",
  },
  description:
    "Rent a car from a trusted local owner in Addis Ababa. Peer-to-peer car rental, no dealerships.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-white text-neutral-900">
        <SeedInitializer />
        {children}
      </body>
    </html>
  );
}