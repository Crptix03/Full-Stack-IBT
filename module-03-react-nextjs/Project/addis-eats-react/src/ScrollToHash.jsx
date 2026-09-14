import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const location = useLocation();

  // ✅ 1. Disable browser's automatic scroll restoration ONCE on mount
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // ✅ 2. Fire on every route change
  useLayoutEffect(() => {
    const HEADER_OFFSET = 80;

    if (location.hash) {
      const timeout = setTimeout(() => {
        const el = document.getElementById(location.hash.replace("#", ""));
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
          window.scrollTo({ top, behavior: "smooth" });
        } else {
          window.scrollTo(0, 0); // ✅ fallback
        }
      }, 100);
      return () => clearTimeout(timeout);
    }

    // No hash — instant scroll to top
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return null;
}