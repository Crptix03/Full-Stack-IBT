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

## Known Limitations

- In-memory data. Orders and users reset on every server restart. A real deployment would use a database (Postgres, SQLite, etc.).
- Plaintext passwords. Demo only. Production requires bcrypt or argon2.
- No account creation. Accounts are pre-seeded. Adding sign-up is out of scope for this project.
- LCP on dish detail is 2.1 s, inside the 2.5 s budget. See PERF.md for the full breakdown.
- Light-theme contrast on a few muted text elements is borderline (Lighthouse Accessibility 94 on /menu). Not a functional issue.
