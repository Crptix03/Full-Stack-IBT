# Royale Bistro — Addis Eats (React)

A React port of the original vanilla JS Royale Bistro / Addis Eats restaurant site — a fine-dining Ethiopian menu and ordering experience, rebuilt with a component-based architecture, real API-style data fetching, and a mobile-first responsive design.

> **Note:** This README is a living document, updated as the project progresses. Home page, routing, cart, order history, checkout, light/dark mode, and account sign-in (with profile/avatar) are all done as of Day 4 — the admin panel is what's left.

---

## Tech Stack

- **React** (Vite)
- **React Router** — client-side routing (`/`, `/menu`, `/cart`, `/checkout`, `/order-history`, `/signin`, `/signup`, `/profile`)
- **React Context + useReducer** — global state for cart (`CartContext`), auth (`AuthContext`), and theme (`ThemeContext`)
- **localStorage** — persists cart, order history, user accounts, and theme choice across reloads (no backend — this is a client-only mock, not real secure auth: passwords are stored in plain text, fine for a school project, never for production)
- **Vanilla CSS** — custom design system via CSS variables, no framework
- Fonts: **Playfair Display** (serif, headings) + **Jost** (sans-serif, UI/body)
- Data: static `menu-data.json` in `public/`, fetched like a real API call

---

## Design System

Dark, gold-accented fine-dining theme, mobile-first throughout, with a full light-mode variant:

| Token                                                                | Dark value                                   | Light value                       | Use                                                                              |
| -------------------------------------------------------------------- | -------------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------- |
| `--bg-color`                                                         | `#0a0a0a`                                    | `#faf7f2`                         | Page background                                                                  |
| `--bg-light-color`                                                   | `#141414`                                    | `#f2ece1`                         | Section backgrounds (e.g. Features strip)                                        |
| `--bg-card-color`                                                    | `#1a1a1a`                                    | `#ffffff`                         | Cards, inputs                                                                    |
| `--color-primary` / `--color-primary-light` / `--color-primary-dark` | `#c8a45c` / `#e8d5a3` / `#a88535`            | `#a88535` / `#c8a45c` / `#8a6b28` | Gold accents, prices, active states                                              |
| `--on-primary`                                                       | `#14110c` (fixed, doesn't change with theme) | —                                 | Text color for anything sitting on top of `--color-primary` (gold buttons/pills) |
| `--color-rust`                                                       | `#a8452e`                                    | `#a8452e`                         | "Spicy" tag                                                                      |
| `--color-sage`                                                       | `#7c8a5e`                                    | `#5f6e46`                         | "Veg" tag                                                                        |
| `--text-color` / `--text-light-color`                                | `#eaeaea` / `#9a9a9a`                        | `#1a1512` / `#6b6258`             | Body text                                                                        |
| `--border-color`                                                     | `rgba(200, 164, 92, 0.2)`                    | `rgba(168, 133, 53, 0.28)`        | Card/section borders (translucent gold)                                          |
| `--radius` / `--radius-sm`                                           | `8px` / `4px`                                | same                              | Corner rounding                                                                  |
| `--transition`                                                       | `0.3s cubic-bezier(0.4, 0, 0.2, 1)`          | same                              | Shared hover/interaction easing                                                  |

Light mode is applied via `[data-theme="light"]` on `<html>`, toggled by the moon/sun icon in the header and persisted in `localStorage`. Because every color in the site is a CSS variable, the whole theme swap needs zero changes to `App.css` — only `index.css`'s token definitions differ between themes.

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
│   │   ├── CartContext.jsx   # global cart state — add/remove/update qty/place order, persisted
│   │   ├── AuthContext.jsx   # mock auth — sign up/in/out, profile (username + avatar), persisted
│   │   └── ThemeContext.jsx  # light/dark mode, persisted
│   ├── Home/
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   ├── Story.jsx          # has id="story" for the header's anchor link
│   │   ├── BestFoods.jsx      # live preview pulled from the same dish data as Menu, + quick-add
│   │   ├── Offers.jsx         # same as BestFoods, different dish slice, + quick-add
│   │   └── Home.jsx
│   ├── Menu/
│   │   ├── CategoryBar.jsx
│   │   ├── DishCard.jsx
│   │   ├── DishList.jsx
│   │   └── Menu.jsx            # supports auto-focusing search via router state
│   ├── Cart/
│   │   └── Cart.jsx            # cart list, quantity steppers, subtotal, "Proceed to Checkout"
│   ├── Checkout/
│   │   └── Checkout.jsx        # delivery/pickup toggle, validated form, order summary
│   ├── OrderHistory/
│   │   └── OrderHistory.jsx    # past orders incl. delivery/pickup details
│   ├── Auth/
│   │   ├── SignIn.jsx
│   │   ├── SignUp.jsx
│   │   └── Profile.jsx         # edit username, upload avatar (stored as base64)
│   ├── ui/
│   │   ├── Button.jsx
│   │   └── Spinner.jsx
│   ├── Footer.jsx
│   ├── Layout.jsx              # persistent header + footer + bottom tab bar (mobile)
│   ├── AccountMenu.jsx         # avatar + dropdown (Profile / Sign Out) in the header
│   ├── RequireAuth.jsx         # route guard — redirects to /signin, returns after login
│   ├── ScrollToHash.jsx        # scrolls to #hash targets on route change (fixes /#story)
│   ├── App.jsx                 # all routes, incl. guarded /checkout and /profile
│   ├── App.css                 # all component styles, mobile-first
│   ├── index.css               # design tokens (dark + light theme) + base styles
│   └── main.jsx                 # wraps App in BrowserRouter + ThemeProvider + AuthProvider + CartProvider
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

### Day 4 — Checkout, light/dark mode, accounts

- Added **real light/dark mode**: a `ThemeContext` toggled by the header's moon/sun icon, persisted in `localStorage`, applied via `[data-theme="light"]` on `<html>`. Since the whole site's styling runs on CSS variables, light mode needed zero changes to `App.css` — only new token values in `index.css`
- Introduced a fixed `--on-primary` token for text sitting on gold buttons/pills, replacing several spots that had reused `var(--bg-color)` as a shortcut — those would have broken in light mode (light text on light gold) if left as-is
- Wired the header **search icon** — navigates to `/menu` and auto-focuses the search input (via React Router navigation state, read in `Menu.jsx`)
- Fixed the `/#story` cross-page scroll bug with a new `ScrollToHash` component — added `id="story"` to the `Story` section (was missing despite the CSS already expecting it) and a `useLocation`-based scroll effect that runs on every route change
- Built a full **checkout flow**: delivery/pickup toggle, name/phone/address form with real validation (Ethiopian phone format `0XXXXXXXXX` / `+251XXXXXXXXX`, letters-only names, minimum-length address that can't be pure digits), a delivery estimate, and an order summary sidebar
- `CartContext`'s `placeOrder` now accepts delivery/pickup details so `OrderHistory` can show who an order was for and where it went, not just what was ordered
- Added **cart + order history persistence** via `localStorage` (previously wiped on every page refresh) — same pattern (reducer + `useEffect` write-through) reused for auth below
- Built a mock **account system** (`AuthContext`): username/password sign up and sign in, persisted in `localStorage`. **Not real secure authentication** — no hashing, no backend — appropriate for a school project only
- Made `/checkout` and `/profile` protected routes via `RequireAuth` — signing in mid-checkout returns the user to `/checkout` afterward instead of dropping them on the homepage
- Replaced the plain "demo ↩" chip with a proper `AccountMenu`: circular avatar (initial letter, or an uploaded photo) that opens a dropdown (Profile / Sign Out) on click, closes on click-outside
- Built a **Profile page**: avatar upload (stored as base64 in `localStorage`, capped at 2MB per image to protect the shared storage quota) and an inline "Edit" toggle for the username instead of an always-open input

### Remaining (Day 5+)

- Then: admin panel (login, dashboard, dish manager, order manager)
