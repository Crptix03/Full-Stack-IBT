# Day 34 — Harden the Addis Eats Application

Today's work made the routed application resilient to partial failures and lighter to load: error boundaries around the riskiest sections, lazy-loaded checkout, a profiled and fixed re-render, and an accessible dish modal rendered through a portal.

## What was built

### 1. `ErrorBoundary`

- `src/ErrorBoundary.jsx` — a class component (the only class in the codebase, since `getDerivedStateFromError` and `componentDidCatch` have no hook equivalent as of the current React version) that accepts a `fallback` prop and renders it in place of any child that throws during render.
- Confirmed by deliberately throwing inside a `Dish` component: the fallback message replaced the menu section, while the header, navigation, and cart badge — all outside the boundary — kept working normally.

### 2. Two independent boundaries

- The menu (index route) and the cart page each got their **own** `ErrorBoundary` instance with a distinct fallback message, so a crash in one does not take down the other. Verified that the two fail independently rather than sharing a single fallback.

### 3. Lazy-loaded checkout

- `src/checkout/Checkout.jsx` is now loaded with `React.lazy()` and wrapped in `<Suspense fallback={<RouteSkeleton />}>`, so its code is only downloaded when the person navigates to `/checkout`, not on initial page load.
- That `Suspense` boundary is itself wrapped in a third `ErrorBoundary`, so a failed chunk download — not just a slow one — shows a fallback message instead of a blank screen.

### 4. Profiling

- Recorded a React DevTools Profiler session (see `PROFILE.md`) capturing render durations across the route tree, including a look at `BrowserRouter`, `ErrorBoundary`, `CartPage`, and `Link` render costs on a single commit.
- The add-three-dishes before/after comparison and the specific re-render fix are tracked in `PROFILE.md`, pending a dedicated profiling pass focused on the "Add" button interaction rather than navigation.

### 5. Dish modal via `createPortal`

- `src/ui/Modal.jsx` renders its content directly under `document.body` using `createPortal`, independent of where `Modal` sits in the component tree — avoiding z-index and overflow-clipping issues from parent containers.
- Clicking a dish's name opens the modal with its full details and an "Add to cart" action.
- **Escape** closes the modal; clicking the overlay also closes it.
- **Focus management**: on open, focus moves into the modal; on close, focus returns to whatever element triggered it (the dish name button).
- **Focus trap**: Tab and Shift+Tab cycle only through focusable elements inside the modal while it's open — keyboard users can no longer tab out to dish cards or nav links sitting behind the overlay.

### 6. Session persistence and sign-out

- Added a "Sign out" link to the header nav (visible only when authenticated), so the `/checkout` auth guard can be exercised repeatedly without manually clearing `localStorage` through DevTools each time.

## Bugs fixed along the way

- The `Suspense`-wrapped checkout route initially had no `ErrorBoundary` around it — `Suspense` alone only handles the _pending_ state, not a _failed_ chunk load. Added a dedicated boundary around the `Suspense` so a failed download shows a fallback instead of leaving a blank screen.
- The modal initially moved focus in on open and returned it on close, but didn't prevent Tab from escaping to background content while open. Added a focus trap that keeps Tab/Shift+Tab cycling only within the modal's own focusable elements.
- `CartPage` had no way back to the menu when the cart was empty — added a "Back to menu" link for that state.

## Verification checklist

- [x] A thrown error in one dish leaves the header and cart badge working
- [x] The menu and cart boundaries fail independently of each other
- [ ] Checkout chunk confirmed to download only on navigation (verify in the Network tab)
- [x] A failed chunk download now shows the boundary fallback rather than a blank screen
- [ ] `PROFILE.md` reflects a real add-three-dishes before/after comparison, not placeholder text
- [x] The modal can be opened (via Tab + Enter on a dish name), used, and closed (Escape) without touching the mouse, with focus trapped inside while open

## Notes

- The two unchecked items above need a dedicated verification pass: opening the Network tab while navigating to `/checkout` fresh, and re-running the Profiler specifically around three "Add to cart" clicks rather than a route change.
- `isAuthenticated` persists in `localStorage`, so sign-in state survives a refresh — the new sign-out link makes this state easy to reset for testing.
