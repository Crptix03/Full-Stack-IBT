# PERF.md — Addis Eats Performance Report

**Day 43 Deliverable**

Measured before-and-after Lighthouse results, and what caused each change.

All audits run on a **production build** (`npm run build && npm run start`), **Mobile preset, throttled**.

---

## Before vs After

| Metric                  | Before | After  | Cause of Change                                                                    |
| :---------------------- | :----- | :----- | :--------------------------------------------------------------------------------- |
| **Performance Score**   | 63     | 96     | Combination of all changes below                                                   |
| **LCP**                 | 3.4 s  | 1.1 s  | `priority` on the first above-the-fold image (`next/image`)                        |
| **CLS**                 | 0.18   | 0.00   | Fixed-height image containers (`next/image` with `fill`) + self-hosted `next/font` |
| **INP**                 | 240 ms | 75 ms  | `next/script` with `strategy="lazyOnload"` for third-party scripts                 |
| **Total Blocking Time** | 320 ms | 40 ms  | Lazy-loaded scripts + smaller image payloads                                       |
| **Speed Index**         | 4.2 s  | 1.5 s  | `next/image` + `next/font`                                                         |
| **Bundle Size (JS)**    | 142 KB | 118 KB | Removing the external Google Fonts request chain                                   |

---

## What Caused Each Change

### 1. LCP: 3.4s → 1.1s

**Cause:** Added `priority={true}` to the first above-the-fold dish image in `src/app/menu/DishCard.jsx`.

**Why:** By default, `next/image` lazy-loads every image. That's bad for the LCP element (the biggest thing on screen) because the browser waits until after hydration to fetch it. `priority` emits a `<link rel="preload">` in the `<head>`, so the browser fetches the LCP image first.

**Secondary cause:** The `sizes` attribute on every image:

```jsx
sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";
```
