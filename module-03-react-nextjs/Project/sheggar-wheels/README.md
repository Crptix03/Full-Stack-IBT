# Sheggar Wheels — Peer-to-Peer Car Rental in Addis

A full-stack car rental marketplace built with Next.js 16, React 19, and Tailwind CSS v4. Owners list cars. Renters book them. An admin approves listings and manages the platform.

**Architecture: Option A — In-Memory Server Storage.** All data lives in `globalThis.__db` on the server. No external database. No localStorage. All pages are Server Components or Server Component + Client Action islands.

---

## Features

- Browse and filter cars by neighbourhood, transmission, seats, price, and keyword
- Car detail pages with photo, specs, owner info, booked date ranges, and reviews
- Interactive map view per car (Leaflet, loaded client-side only)
- Sign in / sign up with httpOnly session cookies (server-side)
- Server-side route protection via `proxy.js`
- Renter dashboard, booking list, booking detail with cancel + review
- Owner dashboard: manage listings, confirm/decline/start/complete bookings, reply to reviews, view earnings
- Admin dashboard: approve/reject listings, manage users, view all bookings and disputes, monthly reports
- AVIF + WebP images via `next/image` with a 1-year cache TTL
- 95–98 Lighthouse mobile performance scores

---

## Getting Started

### Prerequisites

- Node.js 20 or later

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm run start
```

---

## Demo Accounts

| Username | Password | Role |
| :--- | :--- | :--- |
| `dawit` | `dawit2026` | Renter + Owner |
| `hanna` | `hanna2026` | Renter + Owner |
| `yohannes` | `yohannes2026` | Renter |
| `admin` | `admin2026` | Admin |

Use `dawit` or `hanna` to test the owner dashboard. Use `yohannes` to test the renter flow and verify ownership isolation. Use `admin` for the admin dashboard.

---

## Project Structure

```
src/
  app/
    (public)/               Public routes — no auth required
      page.js               Home page (Server Component)
      cars/
        page.js             Car listing with filters (Server Component)
        [id]/
          page.js           Car detail (Server Component)
          map/page.js       Map view (SC + Leaflet client island)
    (renter)/               Protected — any signed-in user
      dashboard/page.js
      bookings/page.js
      bookings/[id]/page.js
      checkout/page.js
    (owner)/                Protected — owner or admin role
      owner/page.js
      owner/cars/...
      owner/bookings/page.js
      owner/reviews/page.js
      owner/earnings/page.js
      owner/disputes/page.js
    (admin)/                Protected — admin role only
      admin/page.js
      admin/listings/page.js
      admin/users/page.js
      admin/bookings/page.js
      admin/disputes/page.js
      admin/reports/page.js
    actions.js              All Server Actions
    layout.js               Root layout
  components/               Shared components (Server + Client)
  lib/
    db.js                   globalThis.__db in-memory database
    session.js              httpOnly cookie session
    auth.js                 Role helpers + account creation
    bookings.js             Booking lifecycle (server-side)
    disputes.js             Dispute lifecycle (server-side)
    reviews.js              Review helpers (server-side)
    users.js                User lookup helpers
    seed.js                 Seed data
    earnings.js             Earnings aggregation
  proxy.js                  Route protection (runs before every request)
```

---

## Documentation

| File | What it covers |
| :--- | :--- |
| `STRATEGY.md` | Rendering strategy for every route — why each page is SC or hybrid |
| `BOUNDARY.md` | Complete Server vs Client Component split with the reasoning |
| `AUTH.md` | Roles, route protection, session cookies, and three negative attack tests |
| `DATA.md` | Every entity, storage key, and data flow from read to write |
| `PERF.md` | Lighthouse measurements, what drives the numbers, and the known ceiling |
| `FUTURE.md` | What was cut, what is limited by design, and the full production migration plan |

---

## Tech Stack

| Layer | Choice |
| :--- | :--- |
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Fonts | Inter via `next/font/google` |
| Maps | Leaflet + react-leaflet (client-side only) |
| Icons | lucide-react |
| Images | next/image (AVIF + WebP, 1-year cache) |
| Auth | httpOnly cookies, proxy-based route protection |
| Data | globalThis in-memory store (demo) |

---

## Known Limitations

- Data resets on every server restart — this is by design for a demo
- Passwords stored in plaintext — demo only, never production
- Photo upload saves to `public/cars/` locally — needs Vercel Blob for production
- No real payment processing — checkout is mocked
- No email or SMS notifications

See `FUTURE.md` for the full migration plan to a production-grade system.
