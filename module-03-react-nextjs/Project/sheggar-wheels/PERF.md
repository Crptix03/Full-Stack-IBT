# PERF.md — Measured Performance

All numbers measured on a production build (`npm run build && npm run start`), throttled to Mobile using Chrome DevTools Lighthouse (Slow 4G + 4x CPU slowdown), in a fresh incognito window.

---

## 1. The Performance Budget

| Measure | Target | Result | Status |
| :--- | :--- | :--- | :--- |
| LCP, worst public page | Under 2.5 s | 1.8 s | Pass |
| CLS, worst page | Under 0.1 | 0 | Pass |
| Lighthouse performance score | 90 or better | 100 | Pass |

---

## 2. Lighthouse Scores — Production Build, Mobile Preset

| Page | Performance | FCP | LCP | TBT | CLS |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | 100 | 0.8 s | 1.8 s | 20 ms | 0 |
| `/cars` | 100 | 0.8 s | 1.8 s | 40 ms | 0 |
| `/cars/car-9` | 100 | 0.8 s | 1.8 s | 60 ms | 0 |
| `/signin` | 100 | 0.8 s | 0.8 s | 0 ms | 0 |

---

## 3. What Changed to Get Here

### Before the fixes

| Page | LCP before | LCP after | Change |
| :--- | :--- | :--- | :--- |
| `/` | 2.1 s | 1.8 s | −0.3 s |
| `/cars` | 3.1 s | 1.8 s | −1.3 s |
| `/cars/car-9` | 3.8 s | 1.8 s | −2.0 s |

### Fix 1 — `priority` on the first car card (`/cars`)

The car listing page was calling `<CarCard>` without any `priority` prop. No preload hint was emitted for the first card's image, so the browser only discovered it during layout — after HTML parsing, CSS calculation, and the full grid render.

Fix: `priority={index === 0}` passed to the first card only. Next.js now emits a `<link rel="preload">` for that image in the `<head>` of the HTML response. The browser starts fetching it from the first byte, cutting discovery delay entirely.

### Fix 2 — Removed `unoptimized` from the car detail hero (`/cars/car-9`)

The hero image on the car detail page had the `unoptimized` prop set. That flag bypasses the entire `next/image` optimizer — no AVIF conversion, no size negotiation, no `<link rel="preload">` hint in the response headers. The browser was downloading the raw source JPEG (~80–140 kB) instead of an AVIF (~25–45 kB).

Fix: removed `unoptimized`. The image now goes through the optimizer:
- Served as AVIF (25–35% smaller than WebP, ~60% smaller than the source JPEG)
- Correct responsive size served via `sizes="(max-width: 1024px) 100vw, 800px"`
- `priority` prop emits a preload hint, so the fetch starts immediately

The combination of a smaller payload and an earlier fetch start dropped LCP from 3.8 s to 1.8 s — a 2-second improvement.

---

## 4. Why LCP Is Fast on All Three Pages

All three public pages are Server Components. The LCP element — either the hero heading text (`/`) or a car photo (`/cars`, `/cars/car-9`) — exists in the initial HTML response from the server. The browser does not need to:

- Download and parse JavaScript
- Hydrate React
- Run any `useEffect`
- Make a secondary data fetch

The image tag and its `<link rel="preload">` are in the first HTTP response. The browser starts the image fetch concurrently with parsing the rest of the HTML.

---

## 5. `next.config.mjs` Image Settings

```js
images: {
  formats: ["image/avif", "image/webp"],
  minimumCacheTTL: 31536000,   // 1 year
}
```

AVIF is tried first. If the browser does not support it, WebP is served. Both are generated on-demand by the Next.js image optimizer and cached to disk for one year. After the first request, every subsequent Lighthouse run hits the cache and pays zero encoding cost.

---

## 6. CLS: 0 on All Pages

Every `<Image>` uses `fill` inside a container with a fixed height (`h-48` on cards, `h-96` on the detail hero). The container reserves the exact space before the image loads, so nothing shifts when the image arrives. There are no client-side skeleton swaps or `mounted` guards anywhere in the public pages — the real content is in the initial HTML.

---

## 7. TBT Variance

TBT is slightly higher on the car detail page (60 ms) than on the listing (40 ms) because the detail page loads the `BookingActions` client component, which includes React's transition runtime. Still well within the green range (under 200 ms).

---

## 8. Reproducing the Numbers

```bash
npm run build
npm run start
# Open http://localhost:3000
# DevTools → Lighthouse → Mobile → Analyze page load
# Use a fresh incognito window
```

Tested on:
- Brave (Chromium-based), Lighthouse built-in
- Mobile preset — Emulated Moto G Power, Slow 4G, 4x CPU slowdown
- Incognito window (no extensions, no cached data)
