// src/ui/StarRating.jsx
export default function StarRating({
  value = 0,
  onChange = null,
  size = 20,
  showEmpty = true,
  precision = 1, // 1 = whole stars, 0.5 = half stars
}) {
  const stars = [1, 2, 3, 4, 5];
  const interactive = typeof onChange === "function";

  // Round to precision (e.g. 4.3 → 4 for precision=1, or 4.5 for precision=0.5)
  const rounded = Math.round(value / precision) * precision;

  return (
    <div
      className={`star-rating ${interactive ? "interactive" : "readonly"}`}
      role={interactive ? "radiogroup" : undefined}
      aria-label={interactive ? "Rate this dish" : `Rated ${value} out of 5`}
    >
      {stars.map((star) => {
        const filled = rounded >= star;
        const halfFilled = !filled && rounded >= star - 0.5 && precision === 0.5;

        return (
          <button
            key={star}
            type="button"
            className={`star ${filled ? "filled" : ""} ${halfFilled ? "half" : ""}`}
            onClick={interactive ? () => onChange(star) : undefined}
            disabled={!interactive}
            aria-label={interactive ? `Rate ${star} star${star > 1 ? "s" : ""}` : undefined}
            style={{ width: size, height: size }}
          >
            <svg
              viewBox="0 0 24 24"
              fill={filled ? "currentColor" : "none"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        );
      })}
      {!showEmpty && value === 0 && null}
    </div>
  );
}