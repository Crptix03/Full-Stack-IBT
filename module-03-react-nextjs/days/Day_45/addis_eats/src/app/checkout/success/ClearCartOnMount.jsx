"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/context";

export default function ClearCartOnMount() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return null;
}