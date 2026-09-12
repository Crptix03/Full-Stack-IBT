# Royale Bistro — Addis Eats (React)

A React port of the original vanilla JS Royale Bistro / Addis Eats restaurant site — a fine-dining Ethiopian menu and ordering experience, rebuilt with a component-based architecture, real API-style data fetching, and a mobile-first responsive design.

> **Status:** The customer ordering flow is implemented, including menu browsing, cart management, checkout, order history, theme switching, and responsive navigation. An admin panel is still planned.

---

## Tech Stack

- **React** (Vite)
- **React Router** — client-side routing (`/`, `/menu`, `/cart`, `/order-history`)
- **React Context + useReducer** — global cart state (`CartContext`)
- **React Context + useState** — persisted light/dark theme state (`ThemeContext`)
- **Vanilla CSS** — custom design system via CSS variables, no framework
- Fonts: **Playfair Display** (serif, headings) + **Jost** (sans-serif, UI/body)
- Data: static `menu-data.json` in `public/`, fetched like a real API call

---

## Design System

Dark, gold-accented fine-dining theme, mobile-first throughout:

| Token                                                                | Value                               | Use                                       |
| -------------------------------------------------------------------- | ----------------------------------- | ----------------------------------------- |
| `--bg-color`                                                         | `#0a0a0a`                           | Page background                           |
| `--bg-light-color`                                                   | `#141414`                           | Section backgrounds (e.g. Features strip) |
| `--bg-card-color`                                                    | `#1a1a1a`                           | Cards, inputs                             |
| `--color-primary` / `--color-primary-light` / `--color-primary-dark` | `#c8a45c` / `#e8d5a3` / `#a88535`   | Gold accents, prices, active states       |
| `--color-rust`                                                       | `#a8452e`                           | "Spicy" tag                               |
| `--color-sage`                                                       | `#7c8a5e`                           | "Veg" tag                                 |
| `--text-color` / `--text-light-color`                                | `#eaeaea` / `#9a9a9a`               | Body text                                 |
| `--border-color`                                                     | `rgba(200, 164, 92, 0.2)`           | Card/section borders (translucent gold)   |
| `--radius` / `--radius-sm`                                           | `8px` / `4px`                       | Corner rounding                           |
| `--transition`                                                       | `0.3s cubic-bezier(0.4, 0, 0.2, 1)` | Shared hover/interaction easing           |

Breakpoints (mobile-first — base styles are phone, then layered up):

- **Phone:** default styles, no media query
- **Tablet:** `min-width: 768px`
- **Desktop:** `min-width: 1024px`

---

## Project Structure

```
addis-eats-react/
├── public/
│   ├── Images/               # real dish photos, hero images
│   └── menu-data.json        # seed data, stands in for a real API
├── src/
│   ├── api/
│   │   └── dishes.js         # fetch helper for menu-data.json
│   ├── hooks/
│   │   └── useFetch.js       # generic fetch hook (loading/error/data)
│   ├── context/
│   │   ├── CartContext.jsx   # global cart state — add/remove/update qty/place order
│   │   └── ThemeContext.jsx  # light/dark theme state persisted in localStorage
│   ├── Home/
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   ├── Story.jsx
│   │   ├── BestFoods.jsx      # live preview pulled from the same dish data as Menu
│   │   ├── Offers.jsx
│   │   └── Home.jsx
│   ├── Menu/
│   │   ├── CategoryBar.jsx
│   │   ├── DishCard.jsx
│   │   ├── DishList.jsx
│   │   └── Menu.jsx
│   ├── Cart/
│   │   └── Cart.jsx           # cart list, quantity steppers, subtotal, place order
│   ├── Checkout/
│   │   └── Checkout.jsx       # delivery/pickup form, validation, fees, order summary
│   ├── OrderHistory/
│   │   └── OrderHistory.jsx   # replaces the earlier Contact placeholder
│   ├── ui/
│   │   ├── Button.jsx
│   │   └── Spinner.jsx
│   ├── Footer.jsx
│   ├── ScrollToHash.jsx       # smooth scrolling for links such as /#story
│   ├── Layout.jsx             # persistent header + footer + bottom tab bar (mobile)
│   ├── App.jsx                # routes: / , /menu , /cart , /checkout , /order-history
│   ├── App.css                # all component styles, mobile-first
│   ├── index.css              # design tokens + base styles
│   └── main.jsx                # wraps App in BrowserRouter + CartProvider
├── index.html
└── package.json
```

---

## Getting Started

```bash
npm install
npm run dev
```

---

## Progress Log

### Day 1 — Project scaffold & Menu page foundation

- Set up Vite + React project (`addis-eats-react`)
- Built feature-based folder structure (`api/`, `hooks/`, `Menu/`, `ui/`)
- Added real dish photos + `menu-data.json` seed data (12 dishes across Starters, Mains, Soups, Desserts, Drinks)
- Built `api/dishes.js` (fetch helper) + `hooks/useFetch.js` (generic loading/error/data hook)
- Built core Menu components: `DishCard`, `DishList`, `CategoryBar`, `Menu`
- Wired `App.jsx` → `Layout` → `Menu`

### Day 2 — Styling, responsiveness, navigation, footer

- Applied the finished dark/gold design system to the Menu page (previously unstyled — `App.css` wasn't imported into `App.jsx`, which was the cause of the broken/unstyled first render)
- Rebuilt all component CSS **mobile-first**: phone is the default ruleset, `min-width: 768px` / `1024px` layer on tablet and desktop enhancements
- Menu grid: 2-column compact cards on phone → 2-column full-size on tablet → 3-column on desktop
- Added **search** (filters by name + description, combines with category filter)
- Added **sticky header + sticky search/category filter bar** while the dish grid scrolls
- Added **bottom tab bar navigation** for mobile (Home / Menu / Cart / Contact) — chosen over a hamburger menu since it's always visible and thumb-reachable, matching familiar food-delivery app patterns
- Added **Favorites** (heart toggle per dish, filterable via the "Favorites" category tab)
- Added `Footer.jsx` (brand, quick nav, opening hours, newsletter, social icons) as part of the persistent `Layout`, so it appears on every page automatically
- Replaced placeholder social "f" / "ig" text with proper SVG icons (Facebook, Instagram), styled to match the site's icon language

### Day 3 — Home page, routing, cart, order history

- Switched the font pairing to **Playfair Display + Jost** and moved to a new color/spacing token system (`--bg-color`, `--color-primary`, `--radius`, `--transition`, etc. — see Design System table above)
- Added **React Router**; `App.jsx` now renders real routes (`/`, `/menu`, `/cart`, `/order-history`) instead of a single hardcoded page
- Converted the Home page mockup into real components: `Hero`, `Features`, `Story`, `BestFoods`, `Offers` — `BestFoods` and `Offers` both pull live data from the same `dishes.js`/`useFetch` the Menu page uses, so there's one source of truth instead of duplicated hardcoded preview data
- Fixed the header/bottom-tab-bar active-state bug from Day 2 (was hardcoded to "Home", now uses React Router's `NavLink` so the highlighted tab always matches the real current page)
- Added a persistent header search icon and theme-toggle icon (currently **decorative only** — no functionality wired up yet)
- Built `CartContext` (Context + `useReducer`) — add to cart, remove, update quantity, place order, running cart count/total, all globally accessible via `useCart()`
- Built the real **Cart page**: line items with image/name/price, quantity steppers, remove button, subtotal, "Place Order" (currently clears the cart into order history — no delivery/payment form yet)
- Replaced the Contact placeholder with **Order History**, reading from the same `CartContext` — shows past orders with itemized breakdown and total once at least one order has been placed
- Added quick **"+ Add"** buttons directly on the Home page's "Our Very Best Foods" and "Try Our Special Offers" preview cards, so items can be added to the cart without navigating to the full Menu page first
- Fixed a dropped-CSS bug from a large freestyle rewrite pass — `.bottom-tab-bar` styling had been accidentally deleted entirely, causing the mobile nav to render as an unstyled list below the footer instead of a fixed bottom bar
- Fixed dish-card styling using hardcoded colors instead of the shared design tokens (was causing a visible mismatch between Menu page cards and Home page preview cards)
- Added a missing tablet-width (768px) column step for the Menu grid (was jumping straight from 1 column on phone to 3 on desktop, skipping tablet)
- Fixed the "Our Story" anchor link — `id="story"` was missing from the `Story` section despite the CSS already expecting it

### Day 4 — Checkout, theme switching, and navigation polish

- Added the `/checkout` route and `Checkout.jsx` with delivery/pickup selection, customer details, Ethiopian phone-number validation, delivery-address validation, delivery fees, estimated preparation times, and an order summary
- Updated `Cart.jsx` so the cart now leads to checkout before an order is placed
- Extended `CartContext.jsx` so placed orders store checkout details, delivery fees, totals, and itemized history; cart and order history remain persisted in `localStorage`
- Added `ThemeContext.jsx` and a header theme toggle with persisted dark/light mode selection
- Added `ScrollToHash.jsx` for smooth in-page and cross-page hash navigation, including the home page's `/#story` link
- Updated `Layout.jsx` with working search navigation, theme controls, checkout-aware routing, and responsive navigation states
- Updated `main.jsx` to provide both `ThemeProvider` and `CartProvider` around the application
- Added light-theme design tokens and checkout/order-history styles in `index.css` and `App.css`

### Remaining

- Admin panel: login, dashboard, dish manager, and order manager
