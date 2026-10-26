"use client";

import { useEffect } from "react";

export function useStorageSync() {
  useEffect(() => {
    const handleStorageChange = () => {
      // When localStorage changes in another tab, reload the page data
      window.location.reload();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
}