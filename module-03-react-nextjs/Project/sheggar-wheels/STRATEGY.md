# STRATEGY.md — Rendering Strategy

Every route in Sheggar Wheels is either a Server Component (rendered on the server, zero client JS) or a hybrid (server shell + thin client island). This document records the decision for every route.

---

## The Rule

> If a route can be rendered without knowing who the user is, or if its data never changes between requests, it is a Server Component.
> If a route requires real-time user interaction (date pickers, confirm dialogs, live state), only the interactive piece is a Client Component — the shell stays on the server.

---

## Route Table

| Route | Strategy | Rendered where | Why |
| :--- | :--- | :--- | :--- |
| `/` | Static SC | Server | Featured cars come from `db.cars` at request time. No session needed. HTML includes car images — LCP is fast. |
| `/cars` | Dynamic SC | Server | Filter/sort/pagination runs on the server using URL search params. No JS needed for the filter form (`<form method="GET">`). |
| `/cars/[slug]` | Static SC | Server | Car data, owner info, reviews, and booked ranges all read from `db.*`. Sidebar CTA is a plain `<Link>`. Pre-rendered at build time via `generateStaticParams`. |
| `/cars/[slug]/map` | SC + Client island | Server + Client | Page shell is a Server Component. The Leaflet map is loaded client-side via `dynamic(..., { ssr: false })` because Leaflet requires the DOM. |
| `/cars/[slug]/opengraph-image` | Route Handler | Server | GET handler using `ImageResponse` + `sharp`. Converts the car photo to PNG (Satori can't decode WebP/AVIF) and renders the OG card. Works at a clean URL in both dev and prod. |
| `/signin` | Client | Client | Uses `useActionState` to wire the `signIn` Server Action and show pending state. The actual auth runs server-side. |
| `/signup` | Client | Client | Same pattern as `/signin` — uses `useActionState` + `signUp` Server Action. |
| `/profile` | Dynamic SC | Server | Reads user, booking stats, and car count from `db.*` using `getSession()`. No interactivity needed. |
| `/unauthorized` | Static SC | Server | Static page — no data, no session needed. Rendered once at build time. |
| `/checkout` | SC + Client island | Server + Client | Server Component reads the car from `db` and passes it as a prop. `CheckoutForm` (client) handles date selection and triggers the `placeBooking` Server Action. |
| `/dashboard` | Dynamic SC | Server | `getSession()` reads the httpOnly cookie. Booking history read from `db.bookings`. No client JS needed. |
| `/bookings` | Dynamic SC | Server | Filter tabs are plain `<Link>` elements with `?filter=` query params. No client state. |
| `/bookings/[id]` | SC + Client island | Server + Client | Server reads and renders all booking data. `BookingActions` (client) handles cancel and review submission via Server Actions. |
| `/owner` | Dynamic SC | Server | Dashboard stats computed server-side from `db.*`. |
| `/owner/bookings` | SC + Client island | Server + Client | Booking list is server-rendered. `OwnerBookingActions` (client) handles confirm/decline/start/complete via Server Actions. |
| `/owner/cars` | Dynamic SC | Server | Car list server-rendered. `DeleteCarButton` is the only client island. |
| `/owner/cars/new` | Client | Client | Entire form is a Client Component using `useActionState` + `addCarAction`. Form fields need controlled state. |
| `/owner/cars/[id]/edit` | SC + Client island | Server + Client | Server reads the car and passes current values. `EditCarForm` (client) is the form. |
| `/owner/reviews` | SC + Client island | Server + Client | Reviews listed server-side. `OwnerReplyForm` (client) handles reply submission. |
| `/owner/earnings` | Dynamic SC | Server | Aggregation runs server-side via `getEarningsBreakdown()`. No interactivity needed. |
| `/owner/disputes` | Dynamic SC | Server | Read-only view of disputes. No actions available for owners. |
| `/admin` | Dynamic SC | Server | Platform stats computed server-side. Quick links to sub-pages. |
| `/admin/listings` | SC + Client island | Server + Client | Car list server-rendered. `AdminCarActions` (client) handles approve/reject. |
| `/admin/users` | SC + Client island | Server + Client | User list server-rendered. `AdminUserActions` (client) handles suspend/activate. |
| `/admin/bookings` | Dynamic SC | Server | Read-only table. No actions needed. |
| `/admin/disputes` | SC + Client island | Server + Client | Dispute list server-rendered. `AdminDisputeActions` (client) handles resolve. |
| `/admin/reports` | Dynamic SC | Server | Aggregated monthly stats, all computed server-side. |

---

## What "Dynamic SC" Means Here

Every Dynamic SC reads directly from `globalThis.__db` (the in-memory server database). There is no network request, no database query latency, and no cache invalidation complexity. After a Server Action mutates `__db` and calls `revalidatePath(...)`, the next request to that route re-reads the fresh data.

The trade-off: data resets on server restart. This is acceptable for a demo; see FUTURE.md for the database migration plan.

---

## The Search Form Pattern

The `/cars` filter form uses `<form method="GET">` — a plain HTML form that submits by appending query parameters to the URL. No JavaScript is involved in applying filters. This means:

- Filters work without JS (progressive enhancement)
- URL is shareable and bookmarkable
- Browser handles the network request; Next.js handles the server render

---

## LCP Considerations

Because the public pages (`/`, `/cars`, `/cars/[slug]`) are Server Components, the LCP image tag exists in the initial HTML response. The browser discovers and fetches it immediately, without waiting for hydration or any `useEffect`. This is why all three pages score **100** on Lighthouse mobile.
