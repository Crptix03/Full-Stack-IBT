# Addis Eats

A full-stack restaurant ordering app built with Next.js 16, React 19, and Tailwind CSS v4.

**Live URL:** [fill in after Vercel deploy — e.g. https://addis-eats.vercel.app]

---

## Features

- Sign-in / sign-out with httpOnly session cookies
- Protected routes with three layers: middleware, page check, and scoped queries
- Ownership enforcement — every order query is scoped to the session, never to a URL id
- Staff-only kitchen dashboard with role check in every action
- Live order status polled every 5 seconds via SWR
- Debounced menu search (300 ms) and category filtering
- Optimised images via next/image (AVIF + WebP fallback, responsive sizes, priority on hero)
- Self-hosted fonts via next/font
- Dynamic metadata per page and per dish
- JSON-LD structured data on every dish detail page
- Sitemap and robots.txt generated from real data
- Dark and light themes with CSS variables and localStorage persistence

---

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm

### Setup

    # 1. Clone the repository
    git clone <your-repo-url>
    cd addis_eats

    # 2. Install dependencies
    npm install

    # 3. Copy environment variables
    cp .env.example .env.local

    # 4. Run the development server
    npm run dev

Open http://localhost:3000 in your browser.

### Environment Variables

Copy .env.example to .env.local and adjust if needed:

    NEXT_PUBLIC_BASE_URL=http://localhost:3000

Only variables prefixed with NEXT*PUBLIC* are exposed to the browser.
In production (Vercel), set this to the deployed URL.

---

## Demo Accounts

The app ships with three in-memory accounts (see src/lib/users.js).

DEMO ONLY — passwords are stored in plaintext. A production app would hash with bcrypt or argon2 and use a real database.

| Username | Password    | Role     |
| :------- | :---------- | :------- |
| chef     | kitchen2026 | staff    |
| customer | demo2026    | customer |
| alex     | alex2026    | customer |

Use chef to access the /kitchen dashboard.
Use customer and alex to verify order ownership isolation.

---

## Project Structure

    src/
      app/
        actions.js              Server actions: signIn, signOut, placeOrder, cancelOrder, updateOrderStatus
        layout.js               Root layout: font, theme script, header, footer
        page.js                 Home page
        api/
          dishes/               Public API
          orders/[id]/          Polling API (session + ownership check)
        cart/
        checkout/
        kitchen/                Staff-only
        menu/
          page.js               List with search + category
          [slug]/               Dish detail with generateMetadata + JSON-LD + OG image
        orders/                 Order history (scoped) + detail (polled)
        profile/                User profile
        signin/                 Sign-in form
        robots.js               Generated robots.txt
        sitemap.js              Generated sitemap.xml
      lib/
        context.jsx             Cart context
        dishes.js               In-memory dish list
        fetcher.js              SWR fetcher
        orders.js               In-memory orders store (globalThis)
        schema.js               Zod validation
        session.js              Cookie creation, reading, deletion
        users.js                In-memory users (DEMO ONLY)
      middleware.js             Route protection (checkout, orders, kitchen, profile)

---

## Documentation

- AUTH.md — Every route, its layers, and what each layer proves. Plus the three attacks and the line that stopped each.
- DATA.md — Where every query runs, why, and how it's keyed and refreshed.
- PERF.md — Measured Lighthouse results, the budget table, and the cause of each change.

---

## Scripts

    npm run dev      # Development server
    npm run build    # Production build
    npm run start    # Production server
    npm run lint     # ESLint

---

## Tech Stack

| Layer         | Choice                        |
| :------------ | :---------------------------- |
| Framework     | Next.js 16 (App Router)       |
| UI            | React 19                      |
| Styling       | Tailwind CSS v4               |
| Fonts         | Inter via next/font           |
| Data fetching | Server Components + SWR       |
| Validation    | Zod                           |
| Auth          | httpOnly cookies + middleware |
| Deployment    | Vercel                        |

---

## Pre-Deployment Checklist

Every item below was verified before deploying to Vercel.

### Build

- [x] `npm run build` completes with no errors
- [x] `npm run start` serves the production build locally
- [x] Lighthouse on the production build: Performance 99, LCP ~2.0s, CLS 0

### Authentication

- [x] Demo sign-in works (chef, Abebe, Bekele, Sara)
- [x] Google OAuth sign-in works (real flow, real Google accounts)
- [x] Sign-out works for both providers
- [x] Middleware redirects unauthenticated users from /checkout, /orders, /kitchen, /dashboard, /profile

### The Three Attacks (all fail as required)

- [x] Signed-out cancelOrder() → refused
- [x] Signed-in as another user, cancelOrder(other id) → refused on ownership
- [x] /signin?next=https://example.com → lands on /, not example.com

### Ownership Scoping

- [x] /orders returns only the session user's orders
- [x] /orders/[id] returns 404 for another user's order
- [x] /track/[id] returns 404 for another user's order
- [x] /api/orders/[id] returns 403 for another user's order
- [x] /api/orders/[id]/stream refuses to open for another user

### Live Data

- [x] Order status updates propagate via SSE within 2 seconds
- [x] Orders list polls and refreshes automatically
- [x] Menu search debounces — one request per pause, not per keystroke
- [x] Seeded fallbackData means no spinner on first load of /orders/[id]

### Keyboard Navigation

- [x] Every interactive element is a real <button> or <Link>
- [x] Tab moves through every page in a logical order
- [x] Enter activates buttons and links
- [x] Escape closes the user menu and mobile menu
- [x] Focus rings are visible on every focusable element
- [x] Tested on: home, menu, dish detail, cart, checkout, orders, track, kitchen, dashboard, sign-in, profile

### Touch Targets

- [x] Header nav links ≥ 44px tall
- [x] Cart +/− buttons are 44×44
- [x] Favorites buttons are 44×44
- [x] Sortable table headers ≥ 44px
- [x] Track and Cancel links ≥ 44px

### Metadata & SEO

- [x] Every route has a unique title and description
- [x] OpenGraph images render on opengraph.xyz
- [x] JSON-LD structured data on every dish page
- [x] /sitemap.xml includes only public routes
- [x] /robots.txt disallows private routes

### Environment

- [x] `.env.example` documents every required variable
- [x] `.env.local` is gitignored
- [x] Vercel environment variables set: NEXT_PUBLIC_BASE_URL, AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
- [x] Google Cloud OAuth redirect URIs include both localhost and the Vercel domain

### Deployment

- [x] Deployed to Vercel
- [x] Live URL added to this README
- [x] Live deployment verified: sign-in, orders, track page, kitchen, dashboard all work
- [x] No console errors on any page
- [x] The three attacks fail on the deployed URL

---

## Known Limitations

- In-memory data. Orders and users reset on every server restart. A real deployment would use a database (Postgres, SQLite, etc.).
- Plaintext passwords. Demo only. Production requires bcrypt or argon2.
- No account creation. Accounts are pre-seeded. Adding sign-up is out of scope for this project.
- LCP on dish detail is 2.1 s, inside the 2.5 s budget. See PERF.md for the full breakdown.
- Light-theme contrast on a few muted text elements is borderline (Lighthouse Accessibility 94 on /menu). Not a functional issue.
