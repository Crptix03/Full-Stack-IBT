# Day 34 — Performance Profile

## Interaction profiled

Clicking **"+ Add to Order"** on a single dish card on the `/menu` page.

## Environment

- Dev server: `npm run dev` (localhost:5173)
- React DevTools: Profiler tab (Flamegraph view)
- CPU: not throttled

## Before

| Metric                      | Value                                                    |
| --------------------------- | -------------------------------------------------------- |
| **Total render time**       | **16.3 ms**                                              |
| Update triggered by         | `CartProvider`                                           |
| Slowest component           | `Layout` (2.5 ms)                                        |
| Components that re-rendered | All 10 `DishCard`s + full tree from `BrowserRouter` down |

**Root cause:** `CartProvider`'s context `value` object was recreated on every render because its callbacks (`addToCart`, `removeFromCart`, `updateQty`, `clearCart`) were not memoized, and the object itself was not `useMemo`'d. Every component in the tree below `CartProvider` re-rendered as a consequence, and `DishCard` was not memoized so it re-rendered even though none of its props had changed.

## Fix applied

Two changes, matching the "parent re-rendered" row in the Day 34 diagnosis table:

### 1. `src/context/CartContext.jsx` — stabilize the context value

- Wrapped `addToCart`, `removeFromCart`, `updateQty`, `clearCart` in `useCallback` with empty dependency arrays (they only call `dispatch`, which is stable).
- Wrapped the context `value` object in `useMemo`, keyed on `state.items` and the four callbacks. The value now only changes reference when the cart contents actually change.

### 2. `src/Menu/DishCard.jsx` — memoize the leaf

- Wrapped `DishCard` in `React.memo`. Combined with the now-stable `onAdd` prop (from `useCart`), `onOpen` (stable `useState` setter), and `dish` (stable object from `Menu`'s `useMemo`'d `filteredDishes`), `DishCard` now only re-renders when its own data changes.

## After

| Metric                      | Value                                        | Change         |
| --------------------------- | -------------------------------------------- | -------------- |
| **Total render time**       | **7.6 ms**                                   | **53% faster** |
| Update triggered by         | `CartProvider`                               | same           |
| Slowest component           | `Layout` (2.1 ms)                            | 16% faster     |
| Components that re-rendered | Only the header cart pill + the clicked card | ~70% fewer     |

**Observation:** Clicking "+ Add to Order" now updates only the cart pill in the header and the one clicked card's "Added ✓" state. The rest of the dish grid — and the rest of the page — no longer re-renders. The remaining cost is `Layout` re-rendering because it displays `cartCount`; that is correct and expected.

## What I tried and reverted

- Initially considered memoizing `DishList` — no measurable benefit, because its parent `Menu` still re-rendered and produced a new `dishes` array prop. Removed the memo since it added code without measurable improvement.

## Bundle analysis (production build)

| Chunk               | Size (gzip) | Belongs in first download?                             |
| ------------------- | ----------- | ------------------------------------------------------ |
| `index-*.js` (main) | 83.77 kB    | ✅ Yes — app shell, Home, Layout, all contexts, router |
| `index-*.css`       | 10.09 kB    | ✅ Yes — styling must be present at first paint        |
| `Checkout-*.js`     | 1.51 kB     | ❌ No — lazy-loaded                                    |
| `Menu-*.js`         | 1.25 kB     | ❌ No — lazy-loaded                                    |
| `OrderHistory-*.js` | 1.20 kB     | ❌ No — lazy-loaded                                    |
| 12 more lazy chunks | < 2 kB each | ❌ No — lazy-loaded                                    |

**Verdict:** 16 separate chunks. Only two load on first paint. All page components and admin panels are code-split and downloaded on demand. A customer who only browses Home + Menu downloads ~95 kB gzipped; they never download any admin chunks.
