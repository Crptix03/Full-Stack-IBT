# BOUNDARY.md — Server vs Client Component Split

The rule that determines every boundary in this project:

> A component is a Server Component unless it needs one of: `useState`, `useEffect`, `useRouter`, `useTransition`, browser APIs, or event handlers. If it needs any of those, only that component (not its parent) is marked `"use client"`.

This keeps the Server Component tree as large as possible, which means less JavaScript shipped to the browser and faster page loads.

---

## Server Components (no `"use client"`)

These files run only on the server. They can read from `db.*`, call `getSession()`, and use `async/await`. They never run in the browser.

| File | What it does |
| :--- | :--- |
| `src/app/(public)/page.js` | Home page — reads featured cars from `db.cars` |
| `src/app/(public)/cars/page.js` | Car listing — filter, sort, paginate on the server |
| `src/app/(public)/cars/[id]/page.js` | Car detail — reads car, owner, reviews, booked dates |
| `src/app/(public)/cars/[id]/map/page.js` | Map page shell — reads car lat/lng |
| `src/app/(public)/layout.js` | Public layout — wraps nav + main + footer |
| `src/app/(renter)/layout.js` | Renter layout — tab nav, no auth guard (proxy handles it) |
| `src/app/(renter)/dashboard/page.js` | Renter dashboard — reads bookings scoped to session |
| `src/app/(renter)/bookings/page.js` | Booking list — filter tabs via URL params |
| `src/app/(renter)/bookings/[id]/page.js` | Booking detail — reads booking, car, owner |
| `src/app/(renter)/checkout/page.js` | Checkout shell — reads car, passes to `CheckoutForm` |
| `src/app/(owner)/layout.js` | Owner layout — tab nav |
| `src/app/(owner)/owner/page.js` | Owner dashboard — stats from `db.*` |
| `src/app/(owner)/owner/bookings/page.js` | Booking requests — reads all owner bookings |
| `src/app/(owner)/owner/cars/page.js` | Car management — reads owner's cars |
| `src/app/(owner)/owner/cars/[id]/edit/page.js` | Edit car shell — reads current car values |
| `src/app/(owner)/owner/reviews/page.js` | Reviews list — reads reviews for owner's cars |
| `src/app/(owner)/owner/earnings/page.js` | Earnings — aggregation via `getEarningsBreakdown()` |
| `src/app/(owner)/owner/disputes/page.js` | Disputes — read-only view |
| `src/app/(admin)/layout.js` | Admin layout — tab nav |
| `src/app/(admin)/admin/page.js` | Admin overview — platform stats |
| `src/app/(admin)/admin/listings/page.js` | Listings moderation — car list |
| `src/app/(admin)/admin/users/page.js` | User management — user list |
| `src/app/(admin)/admin/bookings/page.js` | All bookings — read-only table |
| `src/app/(admin)/admin/disputes/page.js` | Dispute list |
| `src/app/(admin)/admin/reports/page.js` | Monthly reports |
| `src/components/PublicNav.jsx` | Nav — reads session to show/hide links |
| `src/components/PublicFooter.jsx` | Footer — static |
| `src/components/CarCard.jsx` | Car card — used in server-rendered grids |
| `src/components/BookingStatusPill.jsx` | Status badge — pure display |

---

## Client Components (`"use client"`)

These files run in the browser. They are always leaves — they are never the parent of a Server Component.

| File | Why it needs the client | What triggers a Server Action |
| :--- | :--- | :--- |
| `src/app/(public)/signin/page.js` | `useActionState` for form pending state | `signIn` |
| `src/app/(public)/signup/page.js` | `useActionState` for form pending state | `signUp` |
| `src/app/(owner)/owner/cars/new/page.js` | `useActionState` for form state | `addCarAction` |
| `src/components/CheckoutForm.jsx` | Date picker state, availability check | `placeBooking` |
| `src/components/BookingActions.jsx` | Cancel confirm dialog, review form state | `cancelBookingAction`, `submitReviewAction` |
| `src/components/OwnerBookingActions.jsx` | `useTransition` for button pending state | `confirmBookingAction`, `declineBookingAction`, `startRentalAction`, `completeRentalAction` |
| `src/components/OwnerReplyForm.jsx` | Reply text state, open/close toggle | `replyToReviewAction` |
| `src/components/EditCarForm.jsx` | `useActionState` for edit form | `updateCarAction` |
| `src/components/DeleteCarButton.jsx` | Confirm dialog, `useTransition` | `deleteCarAction` |
| `src/components/AdminCarActions.jsx` | `useTransition` for button state | `approveCarAction`, `rejectCarAction` |
| `src/components/AdminUserActions.jsx` | `useTransition` for button state | `suspendUserAction`, `activateUserAction` |
| `src/components/AdminDisputeActions.jsx` | Resolution notes textarea, `useTransition` | `resolveDisputeAction` |
| `src/components/CarMapClient.jsx` | Wraps Leaflet map via `dynamic(..., { ssr: false })` | — |

---

## The Pattern in Detail

Every client island follows the same three-step pattern:

```
Server Component
  → reads data from db.*
  → passes data as props
    → Client Component
        → calls Server Action on user interaction
          → Server Action mutates db.* and calls revalidatePath(...)
            → Next.js re-renders the Server Component with fresh data
```

Example — booking detail page:

```
(renter)/bookings/[id]/page.js    ← Server Component
  reads: db.bookings, db.cars, db.users, db.reviews
  passes: booking, car, owner, existingReview as props
    → BookingActions.jsx           ← Client Component
        cancel button → cancelBookingAction(bookingId)
        review form   → submitReviewAction(bookingId, rating, comment)
          → revalidatePath("/bookings/[id]")
            → page re-renders with updated booking status
```

---

## What This Achieves

- **Zero localStorage** — all state lives server-side in `globalThis.__db`
- **No hydration waterfalls** — pages render complete HTML; client JS only activates interactive islands
- **Progressive enhancement** — filter forms, pagination links, and nav all work without JavaScript
- **Minimal client bundle** — only the interactive components ship JavaScript to the browser
