# DATA.md — Data Storage, Entities, and Flow

Every entity, where it lives, how it is read, and how it is written.

---

## 1. The Database

There is no external database. All data lives in a single `globalThis.__db` object on the Next.js server process:

```js
// src/lib/db.js
if (!globalThis.__db) {
  globalThis.__db = {
    users:    [...SEED_USERS],
    bookings: [...SEED_BOOKINGS],
    cars:     [...SEED_CARS],
    reviews:  [...SEED_REVIEWS],
    disputes: [],
  };
}
export const db = globalThis.__db;
```

`globalThis` persists across requests in the same Node.js process. Hot-reload in development re-initialises it. A server restart resets all data to the seed values.

There is no `localStorage`, no `sessionStorage`, no IndexedDB, and no browser storage of any kind.

---

## 2. Entities

### User

```
{
  id:        "u-owner-1"            // Unique ID
  name:      "Dawit Haile"          // Display name
  username:  "dawit"                // Login identifier
  email:     "dawit@sheggar.et"     // Email (also accepted at login)
  phone:     "+251911000002"        // Optional
  password:  "dawit2026"            // ⚠️ Plaintext — demo only
  roles:     ["renter", "owner"]    // Can hold multiple roles
  status:    "active"               // "active" | "suspended"
  createdAt: ISO string
}
```

### Car

```
{
  id:              "car-1"
  ownerId:         "u-owner-1"
  make:            "Toyota"
  model:           "Corolla"
  year:            2022
  transmission:    "automatic"     // "automatic" | "manual"
  seats:           5
  city:            "Addis Ababa"
  neighbourhood:   "Bole"
  pricePerDay:     2500            // ETB
  photos:          ["/cars/toyota-corolla.jpg"]
  photoPosition:   "center"       // CSS object-position (optional)
  description:     "..."
  status:          "approved"     // "pending" | "approved" | "rejected"
  unavailableDates: []            // Owner-blocked dates (ISO strings)
  createdAt:       ISO string
}
```

### Booking

```
{
  id:            "bk-1"
  carId:         "car-1"
  renterId:      "u-renter-1"
  ownerId:       "u-owner-1"        // Denormalised for fast lookup
  startDate:     "2026-10-11"       // ISO date string (YYYY-MM-DD)
  endDate:       "2026-10-13"
  days:          2
  pricePerDay:   2500
  subtotal:      5000               // pricePerDay × days
  fee:           250                // 5% platform fee
  total:         5250               // subtotal + fee
  paymentStatus: "paid"             // "pending" | "paid"
  status:        "confirmed"        // See transitions below
  createdAt:     ISO string
  updatedAt:     ISO string
}
```

**Valid status transitions:**

```
requested → confirmed | declined | cancelled
confirmed → in_progress | cancelled
in_progress → completed
completed → reviewed
```

Terminal states: `declined`, `cancelled`, `reviewed`, `disputed`, `resolved`.

### Review

```
{
  id:         "rv-1"
  bookingId:  "bk-3"
  carId:      "car-4"
  renterId:   "u-renter-1"
  ownerId:    "u-owner-2"
  rating:     5                // 1–5
  comment:    "..."
  ownerReply: null | "..."
  createdAt:  ISO string
}
```

### Dispute

```
{
  id:               "dispute-abc123"
  bookingId:        "bk-1"
  openedBy:         "u-renter-1"
  reason:           "..."
  description:      "..."
  status:           "open"      // "open" | "resolved"
  resolutionNotes:  null | "..."
  resolvedBy:       null | userId
  createdAt:        ISO string
  resolvedAt:       null | ISO string
}
```

---

## 3. Data Flow Table

The rule: **reads are Server Component inline reads; writes are Server Actions**.

| Operation | Where the read/write happens | Code location |
| :--- | :--- | :--- |
| List approved cars | Inline read in SC | `(public)/cars/page.js` → `db.cars.filter(...)` |
| Get single car | Inline read in SC | `(public)/cars/[id]/page.js` → `db.cars.find(...)` |
| Get renter's bookings | Inline read in SC | `(renter)/dashboard/page.js` → `db.bookings.filter(b => b.renterId === session.userId)` |
| Get owner's bookings | Inline read in SC | `(owner)/owner/bookings/page.js` → `db.bookings.filter(b => b.ownerId === session.userId)` |
| Get admin stats | Inline read in SC | `(admin)/admin/page.js` → aggregates over `db.*` |
| Sign in | Server Action | `actions.js → signIn → createSession(userId, role)` |
| Sign out | Server Action | `actions.js → signOut → destroySession()` |
| Sign up | Server Action | `actions.js → signUp → createRenterAccount → db.users.push(user)` |
| Place booking | Server Action | `actions.js → placeBooking → bookings.js → createBooking → db.bookings.push(booking)` |
| Cancel booking | Server Action | `actions.js → cancelBookingAction → bookings.js → transition → db.bookings[idx].status = "cancelled"` |
| Confirm / Decline booking | Server Action | `actions.js → confirmBookingAction / declineBookingAction → bookings.js` |
| Start / Complete rental | Server Action | `actions.js → startRentalAction / completeRentalAction → bookings.js` |
| Submit review | Server Action | `actions.js → submitReviewAction → bookings.js → submitReview → db.reviews.push(review)` |
| Reply to review | Server Action | `actions.js → replyToReviewAction → reviews.js → db.reviews[idx].ownerReply = reply` |
| Add car | Server Action | `actions.js → addCarAction → db.cars.push(car)` |
| Edit car | Server Action | `actions.js → updateCarAction → db.cars[idx] = {...updated}` |
| Delete car | Server Action | `actions.js → deleteCarAction → db.cars.splice(idx, 1)` |
| Approve / Reject car | Server Action | `actions.js → approveCarAction / rejectCarAction → db.cars[idx].status = ...` |
| Suspend / Activate user | Server Action | `actions.js → suspendUserAction / activateUserAction → db.users[idx].status = ...` |
| Open dispute | Server Action | `actions.js (not yet exposed in UI) → disputes.js → db.disputes.push(dispute)` |
| Resolve dispute | Server Action | `actions.js → resolveDisputeAction → disputes.js → db.disputes[idx].status = "resolved"` |

---

## 4. Session Storage

Session data is stored in two `httpOnly` cookies, not in any client-side store.

| Cookie name | Value | TTL | Flags |
| :--- | :--- | :--- | :--- |
| `session` | User ID (e.g. `u-owner-1`) | 7 days | `httpOnly`, `secure` (prod), `sameSite=lax` |
| `role` | Primary role (e.g. `owner`) | 7 days | Same flags |

These are set by `createSession()` in `src/lib/session.js` and deleted by `destroySession()`.

`getSession()` is called server-side (in Server Components and Server Actions) to read both values.

---

## 5. Platform Fee

The platform fee is calculated at booking creation time and stored on the booking record. It is never recalculated later.

```
fee = Math.round(subtotal * 0.05)   // 5% of subtotal
total = subtotal + fee
```

The owner receives `subtotal`. The platform keeps `fee`. This is recorded on the booking but there is no actual payment processing — all payments are mocked.

---

## 6. Availability Check

Before a booking is created, `isCarAvailable()` in `src/lib/bookings.js` checks two things:

1. **Owner-blocked dates**: any date in `car.unavailableDates` that falls within the requested range blocks the booking.
2. **Overlapping confirmed bookings**: any existing booking with status `confirmed` or `in_progress` that overlaps the requested range blocks the booking.

The overlap check uses half-open interval logic:

```js
if (startDate < b.endDate && b.startDate < endDate) return false; // overlap
```

`requested` and `completed` bookings do not block availability.
