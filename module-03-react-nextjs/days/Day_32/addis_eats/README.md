# Addis Eats

A React ordering application for a fictional Addis Ababa restaurant. Browse a categorized menu fetched from a JSON source, view dish details on their own pages, build a cart backed by a Zustand store, and check out behind a sign-in guard — all wired together with React Router.

## Features

- **Menu browsing** — dishes fetched from `public/dishes.json`, grouped by category, with loading and error states.
- **Category filtering via URL** — the selected category lives in the query string (`?category=mains`), so filtered views are shareable, bookmarkable, and survive a full page reload.
- **Dish detail pages** — each dish links to its own route (`/menu/:id`), reading the id with `useParams` and re-fetching the matching dish.
- **Cart, powered by Zustand** — a standalone store (no Provider required) holding items and the `addItem`, `remove`, and `clear` actions. Every consumer subscribes with a narrow selector, so components only re-render when the specific value they read actually changes.
- **Cart persistence** — the store uses Zustand's `persist` middleware to write to `localStorage`, so the order survives a full page refresh.
- **Persistent header** — navigation and the cart badge live in a shared `Layout`, rendered once and never remounted as the person moves between screens. The badge itself is its own component reading only the item count, so adding a dish re-renders the badge — not the whole header.
- **Authentication guard** — `/checkout` is protected by a `RequireAuth` component built on a `useAuth` hook that throws a clear error if called outside its provider. Signing in redirects back to whichever page the person was trying to reach, and sign-in state survives a page refresh via `localStorage`.
- **Theme context** — a light/dark theme value is provided at the top of the tree and read from a deeply nested `Dish` component, demonstrating context without prop drilling.
- **Not-found handling** — both an unmatched route and an unmatched dish id show a friendly message instead of crashing.
- **Performance** — `Dish` is wrapped in `React.memo`, its add-to-cart handler is stabilized with `useCallback`, and the filtered/sorted dish list is computed with `useMemo`.

## Why Zustand for the cart, but Context for auth

The cart needs frequent, granular updates read by several unrelated components (header badge, dish cards, checkout, cart page) — a state manager with per-value selectors avoids re-rendering the entire tree on every add or remove. Authentication is a single, infrequently-changing boolean read by only a couple of components (the route guard and the sign-in page), so Context's simplicity — no selectors, no separate store file — fits better there. Verified with React DevTools' "highlight updates": adding a dish now flashes only the cart badge, not the header or unrelated menu cards.

## Tech stack

- React (functional components, hooks)
- React Router (`react-router-dom`)
- Zustand (cart state, with the `persist` middleware)
- Context API (`useReducer`-free) for auth and theme state
- `prop-types` for runtime prop validation
- Plain CSS with custom properties for theming

## Project structure

```
addis_eats/
├── public/
│   ├── dishes.json          # Menu data, fetched at runtime
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── auth/
    │   ├── AuthContext.jsx  # Auth state, persisted to localStorage
    │   ├── useAuth.js       # Guarded context hook — throws without a provider
    │   └── RequireAuth.jsx  # Route guard, redirects to /signin
    ├── cart/
    │   └── cartStore.js     # Zustand store: items, actions, persistence, selectors
    ├── context/
    │   └── ThemeContext.jsx # Light/dark theme context
    ├── hooks/
    │   └── useFetch.js      # Fetch hook with loading/error/abort handling
    ├── App.jsx               # Route table
    ├── App.css
    ├── Card.jsx
    ├── CartBadge.jsx          # Reads only the item count, via a selector
    ├── CartPage.jsx            # /cart — order summary, link to checkout
    ├── CategoryBar.jsx
    ├── Checkout.jsx             # /checkout — reads total, clears cart after ordering
    ├── Dish.jsx                  # Reads ThemeContext, links to its detail page
    ├── DishDetail.jsx             # Reads :id via useParams
    ├── DishList.jsx                # React.memo + useCallback
    ├── index.css                   # CSS custom properties, base styles
    ├── Layout.jsx                   # Header, nav, Outlet, footer
    ├── main.jsx
    ├── Menu.jsx                      # Category filter lives in the URL
    ├── NotFound.jsx
    ├── OrderForm.jsx                  # Controlled delivery details form
    └── SignIn.jsx                      # Mock sign-in, returns to the guarded route
```

## Routes

| Path        | Component    | Notes                                   |
| ----------- | ------------ | --------------------------------------- |
| `/`         | `Menu`       | Index route, full menu                  |
| `/menu`     | `Menu`       | Same as index, supports `?category=`    |
| `/menu/:id` | `DishDetail` | Single dish, reads `id` via `useParams` |
| `/cart`     | `CartPage`   | Cart summary with a link to checkout    |
| `/checkout` | `Checkout`   | **Guarded** — requires sign-in          |
| `/signin`   | `SignIn`     | Mock credential form                    |
| `*`         | `NotFound`   | Catch-all for unmatched paths           |

All routes above are nested inside a shared `Layout` route, so the header and footer render once and persist across navigation.

## Getting started

```bash
npm install
npm run dev
```

Open the local dev server URL shown in the terminal.

### Demo sign-in

The `/checkout` route is protected. Use any non-empty username and password on the `/signin` screen — for example:

```
Username: demo
Password: demo123
```

## Cart store

`src/cart/cartStore.js` exposes a single Zustand hook, `useCartStore`, plus two selector helpers:

```javascript
import { useCartStore, selectCount, selectTotal } from "./cart/cartStore";

// Subscribe to only what a component needs:
const count = useCartStore(selectCount);
const total = useCartStore(selectTotal);
const addItem = useCartStore((state) => state.addItem);
```

No `<Provider>` wraps the app — the store exists independently of the component tree, and cart data persists to `localStorage` under the key `addis-eats-cart`.

## Data source

Menu items live in `public/dishes.json` and are fetched at runtime rather than imported directly, so the app reflects a real network round trip (including loading and error states). Each dish has the shape:

```json
{
  "id": "item-1",
  "name": "Crispy Sambusa",
  "category": "starters",
  "price": 100,
  "spicy": true
}
```

## Known limitations

- Sign-in is a mock — any non-empty username and password is accepted; there is no real backend or credential check.
- The search input on the menu page currently only auto-focuses on load and does not filter results live.
- The dark theme variant exists in CSS but has no toggle wired into the UI yet.
- A Redux Toolkit version of the cart slice was written for comparison purposes but was never wired into the app — Zustand remains the store actually in use.
