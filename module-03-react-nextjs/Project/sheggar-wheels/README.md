# Sheggar Wheels — Peer-to-Peer Car Rental in Addis

A full-stack car rental marketplace built with Next.js 16, React 19, and Tailwind CSS v4. Owners list cars. Renters book them. An admin approves listings and manages the platform.

**Architecture: Option A — In-Memory Server Storage.** All data lives in `globalThis.__db` on the server. No external database. No localStorage. All pages are Server Components or Server Component + Client Action islands.

---

## Features

- Browse, filter, sort, and paginate cars by neighbourhood, transmission, seats, price, and keyword
- Car detail pages with slug URLs (`/cars/mazda-cx-5-2022`), photo, specs, reviews, booked dates, map
- Per-car OpenGraph images generated server-side at `/cars/[slug]/opengraph-image`
- Interactive map view per car (Leaflet, client-side only)
- Sign in / sign up with httpOnly session cookies (server-side)
- Server-side route protection via `proxy.js`
- Avatar dropdown nav with role-aware links and sign out
- Profile page with stats and quick links
- Renter: dashboard, booking list, booking detail, cancel, review, file dispute, CSV export
- Owner: dashboard, manage cars with photo upload, confirm/decline/start/complete bookings, reply to reviews, earnings with progress bars and CSV export, disputes
- Admin: approve/reject listings, manage users, all bookings, resolve disputes, monthly reports with CSV export
- Photo upload to `public/cars/` (local) via `/api/upload` route handler
- Loading skeletons on every route (Next.js `loading.js` convention)
- `not-found.js` and `error.js` on every route that can fail
- `/unauthorized` page for wrong-role access attempts
- Sitemap, robots.txt, and root OpenGraph image generated at build time
- AVIF + WebP images via `next/image` with a 1-year cache TTL
- 100 Lighthouse mobile performance score on all public pages

---

## Getting Started

### Prerequisites

- Node.js 20 or later

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local

# 3. Run the development server
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
    (public)/                     Public routes — no auth required
      page.js                     Home page (Server Component)
      profile/
        page.js                   Profile page — stats, quick links
        loading.js
      cars/
        page.js                   Car listing — filter, sort, paginate (SC)
        loading.js
        [slug]/                   Car detail — slug e.g. mazda-cx-5-2022
          page.js                 Car detail (SC + generateStaticParams)
          loading.js
          not-found.js
          error.js
          opengraph-image/
            route.jsx             Per-car OG image route handler (sharp + ImageResponse)
          map/
            page.js               Map page (SC + Leaflet client island)
            MapComponent.jsx
      signin/page.js
      signup/page.js
    (renter)/                     Protected — any signed-in user
      layout.js
      dashboard/
        page.js
        loading.js
      bookings/
        page.js
        loading.js
        [id]/
          page.js
          loading.js
          not-found.js
          error.js
      checkout/page.js
    (owner)/                      Protected — owner or admin role
      layout.js
      owner/
        page.js                   Owner dashboard
        loading.js
        bookings/page.js, loading.js
        cars/
          page.js, loading.js
          new/page.js
          [id]/edit/page.js, error.js, not-found.js
        reviews/page.js, loading.js
        earnings/page.js, loading.js
        disputes/page.js, loading.js
    (admin)/                      Protected — admin role only
      layout.js
      admin/
        page.js                   Admin overview
        loading.js
        listings/page.js, loading.js
        users/page.js, loading.js
        bookings/page.js, loading.js
        disputes/page.js, loading.js
        reports/page.js, loading.js
    api/
      upload/route.js             Photo upload — saves to public/cars/ locally
    actions.js                    All Server Actions
    layout.js                     Root layout (metadata, fonts)
    opengraph-image.jsx           Site-wide OG image (pure CSS, no photo)
    sitemap.js                    Generated sitemap.xml
    robots.js                     Generated robots.txt
    not-found.js                  Root 404 page
    error.js                      Root error boundary
    unauthorized/page.js          Wrong-role access page

  components/
    AdminCarActions.jsx           Approve/reject buttons (client)
    AdminDisputeActions.jsx       Resolve dispute form (client)
    AdminUserActions.jsx          Suspend/activate buttons (client)
    BookingActions.jsx            Cancel + review form (client)
    BookingStatusPill.jsx         Status badge (server)
    CarCard.jsx                   Car card with slug link (server)
    CarMapClient.jsx              Leaflet wrapper via dynamic() (client)
    CheckoutForm.jsx              Date picker + payment (client)
    DeleteCarButton.jsx           Confirm + delete (client)
    DisputeForm.jsx               File a dispute form (client)
    EditCarForm.jsx               Edit car form (client)
    ExportCsvButton.jsx           CSV download button (client)
    OwnerBookingActions.jsx       Confirm/decline/start/complete (client)
    OwnerReplyForm.jsx            Reply to review (client)
    PhotoUpload.jsx               Drag-and-drop photo upload (client)
    PublicFooter.jsx              Footer (server)
    PublicNav.jsx                 Nav with UserMenu (server)
    Skeleton.jsx                  Skeleton building blocks
    UserMenu.jsx                  Avatar dropdown (client)

  lib/
    auth.js                       Role helpers + createRenterAccount
    bookings.js                   Booking lifecycle — server-side
    csv.js                        CSV export helpers
    db.js                         globalThis.__db in-memory database
    disputes.js                   Dispute lifecycle — server-side
    earnings.js                   Earnings aggregation
    format.js                     ETB currency formatter
    format-date.js                Date helpers
    id.js                         ID generator
    reviews.js                    Review helpers — server-side
    seed.js                       Seed data (users, cars, bookings, reviews)
    session.js                    httpOnly cookie session
    slug.js                       toCarSlug + findCarBySlug
    users.js                      User lookup helpers

  proxy.js                        Route protection (runs before every request)
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
| OG Images | `next/og` ImageResponse + sharp (server-side) |
| Auth | httpOnly cookies, proxy-based route protection |
| Data | globalThis in-memory store (demo) |
| Image processing | sharp (WebP/AVIF → PNG for OG image rendering) |

---

## Car URLs

Car detail pages use human-readable slugs generated from make + model + year:

| Car | URL |
| :--- | :--- |
| Mazda CX-5 (2022) | `/cars/mazda-cx-5-2022` |
| Toyota Corolla (2022) | `/cars/toyota-corolla-2022` |
| Toyota Land Cruiser (2020) | `/cars/toyota-land-cruiser-2020` |

OG image for each car is available at `/cars/[slug]/opengraph-image` — works in both dev and prod.

---

## Known Limitations

- Data resets on every server restart — this is by design for a demo
- Passwords stored in plaintext — demo only, never production
- Photo upload saves to `public/cars/` locally — needs Vercel Blob for production
- No real payment processing — checkout is mocked
- No email or SMS notifications

See `FUTURE.md` for the full migration plan to a production-grade system.
