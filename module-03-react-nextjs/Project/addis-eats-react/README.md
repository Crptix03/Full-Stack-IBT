# Addis Eats React

A full React restaurant web app for a modern Ethiopian food brand. This project combines a customer-facing food ordering experience with a working admin panel for menu, order, and user management.

The app is built with Vite + React and uses localStorage as a mock backend so the project works fully in the browser without a separate server.

---

## Project overview

This project was built as a complete restaurant management and ordering experience for Addis Eats. It includes:

- Customer homepage and landing page
- Menu browsing with categories, search, and favorites
- Cart with quantity updates and totals
- Checkout flow with validation and order placement
- Customer order history
- Sign up / sign in / profile management
- Light and dark theme switching
- Admin dashboard with revenue and order stats
- Menu management for dishes
- Order tracking and status updates
- User management for customers and admin accounts
- Error boundaries, lazy-loaded routes, and a portal-based modal for resilience and performance

---

## Features

### Customer side

- Responsive restaurant landing page with hero, story, offers, and featured dishes
- Search and filtering by category
- Favorites section and favorite dish toggling
- Add-to-cart flow with persistent cart state
- Checkout form with validation for customer details
- Delivery and pickup options
- Order confirmation screen with matching order ID from Order History
- Profile page with avatar upload and username editing
- Account creation and sign-in flow
- Theme toggle between dark and light mode
- Reorder button on past orders that re-adds all items to the cart

### Admin side

- Protected admin route using role-based access
- Dashboard with revenue, average order value, top dishes, and recent orders
- Menu manager to add, edit, hide/show, and remove dishes
- Order manager to update statuses like pending, preparing, on-the-way, delivered, and cancelled
- User manager to inspect registered users and identify admin accounts
- Persistent localStorage-backed menu and order data

### Resilience & Performance

- **Error boundaries** placed at meaningful seams — one wraps the whole app as a last resort, and each page (Menu, Cart, Checkout, etc.) has its own boundary so a failure in one region does not blank the entire screen.
- **On-brand fallback UI** for caught errors, with a "Try Again" button that resets the boundary and a link back to the menu.
- **Dev-only error details** — the stack trace and message only render in development; production builds hide them from users.
- **Route-based code splitting** with `React.lazy` + `Suspense`. Every page except Home is a separate chunk, downloaded only when the user navigates to it.
- **Skeleton loading state** (`PageSkeleton`) shown while lazy chunks are downloading — a shape roughly matching the incoming content, so the layout doesn't jump.
- **Portal-based modals** using `createPortal` — dish details render into a `#modal-root` div outside the app tree so they escape `overflow: hidden` on any ancestor card.
- **Accessible modal behavior** — focus moves into the modal on open, `Escape` closes it, and focus returns to the triggering element on close. Includes `role="dialog"` and `aria-labelledby`.
- **Profiled and fixed a re-render** — clicking "+ Add to Order" dropped from **16.3 ms to 7.6 ms** (53% faster) after memoizing the cart context value and wrapping `DishCard` in `React.memo`. Full details in `PROFILE.md`.

---

## Tech stack

- React 18
- Vite
- React Router
- Context API + useReducer
- `React.lazy` + `Suspense` for route-based code splitting
- `createPortal` for accessible modals
- Error boundaries (class components) for runtime resilience
- `React.memo`, `useCallback`, `useMemo` for targeted performance work
- CSS custom properties and responsive styling
- localStorage for demo persistence

---

## Default admin account

Use this account to access the admin panel:

- Username: admin
- Password: royale2026

---

## Project structure

```bash
addis-eats-react/
├── .gitignore
├── eslint.config.js
├── index.html                    # includes #root and #modal-root
├── package-lock.json
├── package.json
├── PROFILE.md                    # Day 34 performance profile
├── vite.config.js
├── public/
│   ├── menu-data.json
│   └── images/
├── src/
│   ├── admin/
│   │   ├── AdminLayout.jsx
│   │   ├── Dashboard.jsx
│   │   ├── DishForm.jsx
│   │   ├── DishManager.jsx
│   │   ├── OrderManager.jsx
│   │   ├── RequireAdmin.jsx
│   │   └── UserManager.jsx
│   ├── Auth/
│   │   ├── Profile.jsx
│   │   ├── SignIn.jsx
│   │   ├── SignUp.jsx
│   │   └── PasswordInput.jsx
│   ├── Cart/
│   │   └── Cart.jsx
│   ├── Checkout/
│   │   ├── Checkout.jsx
│   │   └── OrderConfirmation.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   ├── FavoritesContext.jsx
│   │   ├── MenuContext.jsx
│   │   ├── OrderContext.jsx
│   │   └── ThemeContext.jsx
│   ├── Home/
│   │   ├── BestFoods.jsx
│   │   ├── Features.jsx
│   │   ├── Hero.jsx
│   │   ├── Home.jsx
│   │   ├── Offers.jsx
│   │   └── Story.jsx
│   ├── Menu/
│   │   ├── CategoryBar.jsx
│   │   ├── DishCard.jsx          # memoized leaf
│   │   ├── DishList.jsx
│   │   ├── Favorites.jsx
│   │   ├── Menu.jsx
│   │   └── DishModal.jsx         # uses <Modal /> portal
│   ├── OrderHistory/
│   │   └── OrderHistory.jsx
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Modal.jsx             # createPortal + focus trap + Escape
│   │   ├── PageSkeleton.jsx      # Suspense fallback
│   │   └── Spinner.jsx
│   ├── AccountMenu.jsx
│   ├── App.css
│   ├── App.jsx                   # lazy routes + error boundaries
│   ├── ErrorBoundary.jsx         # class component
│   ├── Footer.jsx
│   ├── index.css
│   ├── Layout.jsx
│   ├── main.jsx
│   ├── RequireAuth.jsx
│   └── ScrollToHash.jsx
└── README.md
```

---

## Installation and run

1. Open the project folder:

```bash
cd addis-eats-react
```

2. Install dependencies:

```bash
npm install
```

3. Start the app in development mode:

```bash
npm run dev
```

4. Open the local URL shown in the terminal (usually `http://localhost:5173`).

### Production build (used for performance profiling)

```bash
npm run build
npm run preview
```

Open `http://localhost:4173` to see the fully optimized production bundle.

---

## Verifying the Day 34 hardening

### Error boundary

Visit `/menu?crash=1` in **development mode** — a dish will throw during render, and the error boundary around the Menu route will show the fallback. The header, cart pill, and footer remain fully functional.

(The throw is guarded by `import.meta.env.DEV` and `dish.id`, so it never fires in production builds.)

### Lazy loading

Run `npm run build` and look at the output. You'll see one chunk per lazy route (`Menu-*.js`, `Checkout-*.js`, `OrderHistory-*.js`, `Dashboard-*.js`, etc.) plus the main `index-*.js` bundle.

On a Slow 3G network profile, navigating to a lazy route shows the `<PageSkeleton />` fallback while the chunk downloads.

### Portal modal

Open a dish from the menu — inspect the DOM and confirm the modal renders inside `#modal-root` (outside `#root`), not inside the dish grid. Keyboard: `Escape` closes it; focus returns to the dish card that opened it.

### Performance profile

`PROFILE.md` documents the measured re-render that was identified and fixed during this stage of the project. It records which interaction was profiled, the before/after render times, the root cause, the two changes that were applied, and what was reverted after measurement showed no benefit.

---

## Important notes

- This is a front-end demo project, so authentication and data are stored in localStorage.
- Passwords are not encrypted, which is fine for learning and demonstration but not production-safe.
- The app is designed to showcase a complete restaurant workflow in one browser-based project.
- The Day 34 error boundary demo (`/menu?crash=1`) is intentionally guarded to development only — production builds are unaffected.

---

## Summary

This project demonstrates a working restaurant app from start to finish:

- user-facing ordering experience
- shopping cart and checkout flow
- profile and account system
- admin dashboard and store management
- responsive design and theme switching
- resilient runtime with error boundaries
- route-based code splitting and skeleton loading states
- accessible, portal-based modals
- measured and fixed a real performance bottleneck

It was built as a practical React project to simulate how a real restaurant website and business dashboard could work together in one application.
