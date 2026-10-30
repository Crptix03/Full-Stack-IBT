"use client";

import { useEffect } from "react";

export function useStorageSync() {
  useEffect(() => {
    const handleStorageChange = () => {
      window.location.reload();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
}