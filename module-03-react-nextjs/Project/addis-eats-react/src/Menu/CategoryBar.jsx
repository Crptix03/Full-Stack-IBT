import { useEffect, useRef, useState } from "react";

const CATEGORY_LABELS = {
  all: "All Items",
  starters: "Starters",
  mains: "Main Course",
  soups: "Soups",
  desserts: "Desserts",
  drinks: "Drinks",
  favorites: "Favorites",
};

export default function CategoryBar({ categories, active, onSelect }) {
  const barRef = useRef(null);
  const [overflow, setOverflow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, ["all", ...categories, "favorites"].indexOf(active))
  );

  const justTappedRef = useRef(false);

  const allCategories = ["all", ...categories, "favorites"];

  // Detect overflow
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const checkOverflow = () => {
      setOverflow(el.scrollWidth > el.clientWidth + 4);
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [categories]);

  // Sync dot to active prop
  useEffect(() => {
    const idx = allCategories.indexOf(active);
    if (idx >= 0) setActiveIndex(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Auto-scroll active pill into view
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;

    const idx = allCategories.indexOf(active);
    const buttons = el.querySelectorAll(".cat-btn");
    if (buttons[idx]) {
      justTappedRef.current = true;
      buttons[idx].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
      // Release the tap flag after the smooth scroll settles
      setTimeout(() => {
        justTappedRef.current = false;
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const handleScroll = () => {
    const el = barRef.current;
    if (!el) return;

    // If we're mid-smooth-scroll from a tap, don't override the dot
    if (justTappedRef.current) return;

    const buttons = el.querySelectorAll(".cat-btn");
    if (buttons.length === 0) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const center = el.scrollLeft + el.clientWidth / 2;

    // Find nearest pill by center
    let bestIndex = 0;
    let bestDelta = Infinity;

    buttons.forEach((btn, i) => {
      const btnCenter = btn.offsetLeft + btn.offsetWidth / 2;
      const delta = Math.abs(btnCenter - center);
      if (delta < bestDelta) {
        bestDelta = delta;
        bestIndex = i;
      }
    });

    // Only clamp to the extremes if the scroll is truly at the edge
    // AND the nearest pill isn't already correct
    if (el.scrollLeft <= 1) {
      setActiveIndex(0);
      return;
    }
    if (el.scrollLeft >= maxScroll - 1) {
      setActiveIndex(buttons.length - 1);
      return;
    }

    setActiveIndex(bestIndex);
  };

  return (
    <div className="category-bar-wrap">
      <div ref={barRef} className="category-bar" onScroll={handleScroll}>
        {allCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`cat-btn ${active === cat ? "active" : ""}`}
            onClick={() => onSelect(cat)}
          >
            {CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      {overflow && (
        <div className="category-dots" aria-hidden="true">
          {allCategories.map((_, i) => (
            <span
              key={i}
              className={`category-dot ${i === activeIndex ? "active" : ""}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}