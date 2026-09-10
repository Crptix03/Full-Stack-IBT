# Royale Bistro — Addis Eats (React)

A React port of the original vanilla JS Royale Bistro / Addis Eats restaurant site — a fine-dining Ethiopian menu and ordering experience, rebuilt with a component-based architecture, real API-style data fetching, and a mobile-first responsive design.

> **Note:** This README is a living document and will be updated through Saturday as the project progresses (Home page, routing, cart, checkout, and the admin panel).

---

## Tech Stack

- **React** (Vite)
- **Vanilla CSS** — custom design system via CSS variables, no framework
- Fonts: **Fraunces** (serif, headings) + **Inter** (sans-serif, UI/body)
- Data: static `menu-data.json` in `public/`, fetched like a real API call

---

## Design System

Dark, gold-accented fine-dining theme, mobile-first throughout:

| Token                                 | Value                 | Use                            |
| ------------------------------------- | --------------------- | ------------------------------ |
| `--bg-base`                           | `#15120E`             | Page background                |
| `--bg-surface`                        | `#1E1A14`             | Cards, inputs                  |
| `--gold` / `--gold-bright`            | `#C9A24B` / `#E3BE6E` | Accents, prices, active states |
| `--rust`                              | `#A8452E`             | "Spicy" tag                    |
| `--sage`                              | `#7C8A5E`             | "Veg" tag                      |
| `--text-primary` / `--text-secondary` | `#EFE7D8` / `#A6987F` | Body text                      |
| `--border-hairline`                   | `#332C1F`             | Card/section borders           |

Breakpoints (mobile-first — base styles are phone, then layered up):

- **Phone:** default styles, no media query
- **Tablet:** `min-width: 768px`
- **Desktop:** `min-width: 1024px`

---

## Project Structure

```
addis-eats-react/
├── public/
│   ├── Images/            # real dish photos, hero images
│   └── menu-data.json     # seed data, stands in for a real API
├── src/
│   ├── api/
│   │   └── dishes.js      # fetch helper for menu-data.json
│   ├── hooks/
│   │   └── useFetch.js    # generic fetch hook (loading/error/data)
│   ├── Menu/
│   │   ├── CategoryBar.jsx
│   │   ├── DishCard.jsx
│   │   ├── DishList.jsx
│   │   └── Menu.jsx
│   ├── ui/
│   │   ├── Button.jsx
│   │   └── Spinner.jsx
│   ├── Footer.jsx
│   ├── Layout.jsx          # persistent header + footer + bottom tab bar (mobile)
│   ├── App.jsx
│   ├── App.css             # all component styles, mobile-first
│   ├── index.css           # design tokens + base styles
│   └── main.jsx
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

### Day 1 (Wednesday) — Project scaffold & Menu page foundation

- Set up Vite + React project (`addis-eats-react`)
- Built feature-based folder structure (`api/`, `hooks/`, `Menu/`, `ui/`)
- Added real dish photos + `menu-data.json` seed data (12 dishes across Starters, Mains, Soups, Desserts, Drinks)
- Built `api/dishes.js` (fetch helper) + `hooks/useFetch.js` (generic loading/error/data hook)
- Built core Menu components: `DishCard`, `DishList`, `CategoryBar`, `Menu`
- Wired `App.jsx` → `Layout` → `Menu`

### Day 2 (Thursday) — Styling, responsiveness, navigation, footer

- Applied the finished dark/gold design system to the Menu page (previously unstyled — `App.css` wasn't imported into `App.jsx`, which was the cause of the broken/unstyled first render)
- Rebuilt all component CSS **mobile-first**: phone is the default ruleset, `min-width: 768px` / `1024px` layer on tablet and desktop enhancements
- Menu grid: 2-column compact cards on phone → 2-column full-size on tablet → 3-column on desktop
- Added **search** (filters by name + description, combines with category filter)
- Added **sticky header + sticky search/category filter bar** while the dish grid scrolls
- Added **bottom tab bar navigation** for mobile (Home / Menu / Cart / Contact) — chosen over a hamburger menu since it's always visible and thumb-reachable, matching familiar food-delivery app patterns
- Added **Favorites** (heart toggle per dish, filterable via the "Favorites" category tab)
- Added `Footer.jsx` (brand, quick nav, opening hours, newsletter, social icons) as part of the persistent `Layout`, so it appears on every page automatically
- Replaced placeholder social "f" / "ig" text with proper SVG icons (Facebook, Instagram), styled to match the site's icon language

### Known issues / TODO

- No routing yet — currently only the Menu page exists as real React (Home is still an HTML/CSS mockup, not yet converted to components)
- Bottom tab bar and header nav links are static (`href="#"`) — not wired to real navigation yet
- Cart is not implemented — "Add to Order" currently just logs to the console

### Remaining (Day 3–4)

- Convert Home page mockup (hero, features, Our Story, Our Very Best Foods preview) into real React components
- Add **React Router** so Home/Menu are real, separate routes with correctly synced active states in both the header nav and the bottom tab bar
- Build cart (`cart/` — cart store, `CartPanel`, `CartBadge`) and wire up "Add to Order"
- Build checkout (`checkout/` — form, validation, delivery estimate)
- Build admin panel (login, dashboard, dish manager, order manager)
