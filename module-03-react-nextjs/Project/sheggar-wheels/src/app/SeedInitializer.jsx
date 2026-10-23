"use client";

import { useEffect } from "react";
import { initializeDemoData } from "@/lib/seed";

export default function SeedInitializer() {
  useEffect(() => {
    try {
      initializeDemoData();
    } catch (err) {
      console.error("Seed initialization failed:", err);
    }
  }, []);

  return null;
}