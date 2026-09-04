# Addis Eats

A React ordering application for a fictional Addis Ababa restaurant. Browse a categorized menu fetched from a JSON source, view dish details on their own pages, build a cart backed by Context and a reducer, and check out behind a sign-in guard — all wired together with React Router.

## Features

- **Menu browsing** — dishes fetched from `public/dishes.json`, grouped by category, with loading and error states.
- **Category filtering via URL** — the selected category lives in the query string (`?category=mains`), so filtered views are shareable, bookmarkable, and survive a full page reload.
- **Dish detail pages** — each dish links to its own route (`/menu/:id`), reading the id with `useParams` and re-fetching the matching dish.
- **Cart** — powered by a `useReducer`-based cart store shared through Context. Supports adding, removing, and clearing items, with the order total derived fresh on every render rather than stored separately.
- **Persistent header** — cart count and navigation live in a shared `Layout`, rendered once and never remounted as the person moves between screens.
- **Authentication guard** — `/checkout` is protected by a `RequireAuth` component. Signing in redirects back to whichever page the person was trying to reach, and sign-in state survives a page refresh via `localStorage`.
- **Theme context** — a light/dark theme value is provided at the top of the tree and read from a deeply nested `Dish` component, demonstrating context without prop drilling.
- **Not-found handling** — both an unmatched route and an unmatched dish id show a friendly message instead of crashing.
- **Performance** — `Dish` is wrapped in `React.memo`, its add-to-cart handler is stabilized with `useCallback`, and the filtered/sorted dish list is computed with `useMemo`.

## Tech stack

- React (functional components, hooks)
- React Router (`react-router-dom`)
- Context API + `useReducer` for cart and auth state
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
    │   └── RequireAuth.jsx  # Route guard, redirects to /signin
    ├── cart/
    │   ├── CartProvider.jsx # useReducer + memoised context value
    │   └── cartReducer.js   # Pure reducer: ADD, REMOVE, CLEAR
    ├── context/
    │   └── ThemeContext.jsx # Light/dark theme context
    ├── hooks/
    │   └── useFetch.js      # Fetch hook with loading/error/abort handling
    ├── App.jsx               # Route table
    ├── App.css
    ├── Card.jsx
    ├── CategoryBar.jsx
    ├── CheckoutPanel.jsx     # Reads cart from context, no props
    ├── Dish.jsx               # Reads ThemeContext, links to its detail page
    ├── DishDetail.jsx         # Reads :id via useParams
    ├── DishList.jsx           # React.memo + useCallback
    ├── Header.jsx
    ├── index.css              # CSS custom properties, base styles
    ├── Layout.jsx             # Header, nav, Outlet, footer
    ├── main.jsx
    ├── Menu.jsx                # Category filter lives in the URL
    ├── NotFound.jsx
    ├── OrderForm.jsx           # Controlled delivery details form
    └── SignIn.jsx              # Mock sign-in, returns to the guarded route
```

## Routes

| Path        | Component      | Notes                                   |
| ----------- | -------------- | --------------------------------------- |
| `/`         | `Menu`         | Index route, full menu                  |
| `/menu`     | `Menu`         | Same as index, supports `?category=`    |
| `/menu/:id` | `DishDetail`   | Single dish, reads `id` via `useParams` |
| `/cart`     | `CartPage`     | Cart summary with a link to checkout    |
| `/checkout` | `CheckoutPage` | **Guarded** — requires sign-in          |
| `/signin`   | `SignIn`       | Mock credential form                    |
| `*`         | `NotFound`     | Catch-all for unmatched paths           |

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
