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

  useEffect(() => {
    const idx = allCategories.indexOf(active);
    if (idx >= 0) setActiveIndex(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

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
      setTimeout(() => {
        justTappedRef.current = false;
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const handleScroll = () => {
    const el = barRef.current;
    if (!el) return;

    if (justTappedRef.current) return;

    const buttons = el.querySelectorAll(".cat-btn");
    if (buttons.length === 0) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const center = el.scrollLeft + el.clientWidth / 2;

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