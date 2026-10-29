# FUTURE.md — Cuts, Limitations, and What Comes Next

An honest list of what was deliberately left out, what is broken by design, and what a production version would fix.

---

## 1. Deliberate Cuts (Not Bugs)

These were scoped out to keep the project focused and completable.

### No real payment processing

All payments are mocked. The checkout page simulates a TeleBirr payment and always succeeds. No real money is involved. A production version would integrate a real payment gateway (Chapa, Stripe, or a direct TeleBirr API).

### Photo upload (local — Vercel Blob needed for production)

Photo upload is implemented for local development. Owners can drag-and-drop or click to upload a JPEG, PNG, or WebP image (max 5 MB) when adding or editing a car. The file is saved to `public/cars/` via the `/api/upload` Route Handler.

This works locally because Next.js dev server has a writable filesystem. **On Vercel, `public/` is read-only** — uploaded files would be lost on every deploy. The production fix is to replace the `writeFile` call in `/api/upload/route.js` with Vercel Blob:

```js
// Replace writeFile with:
import { put } from "@vercel/blob";
const blob = await put(filename, buffer, { access: "public" });
return NextResponse.json({ path: blob.url });
```

Requires: `npm install @vercel/blob` and a `BLOB_READ_WRITE_TOKEN` environment variable from the Vercel dashboard.

### No email or SMS notifications

There are no notifications of any kind. Owners do not receive an email when a booking is requested. Renters do not receive a confirmation. A production version would use Resend (email) or Africa's Talking (SMS for Ethiopian numbers).

### No real-time booking status

The booking status page shows the status at the time of the last server render. There is no polling or WebSocket. A production version would use SWR with a polling interval to show live status updates.

### No dispute filing from the UI (resolved)

The dispute system is fully implemented. Both renters (on `/bookings/[id]`) and owners (on `/owner/bookings`) see a "File a Dispute" button on any confirmed or in_progress booking. The admin resolves disputes at `/admin/disputes`.

### No map for listing creation

When an owner adds a new car, they pick a neighbourhood from a dropdown. There is no map pin for precise location. The `latitude` and `longitude` fields on the car entity are seeded manually. A production version would use the Mapbox Geocoding API to convert an address to coordinates.

---

## 2. Limitations by Design (Known Constraints)

These are properties of the current architecture that are intentional for a demo but would need changing in production.

### Data resets on server restart

The entire database lives in `globalThis.__db`. Every server restart — including hot-reload in development — resets all data to the seed values. Any bookings, new users, or car listings created during a session are lost.

This is acceptable for a demo where the goal is to demonstrate the architecture, not to persist real data.

### Plaintext passwords

User passwords are stored as plain strings in `SEED_USERS` and in `db.users` for newly registered users. `signIn` compares them with `===`.

```js
// ⚠️ This line is in actions.js
if (!user || user.password !== password) { ... }
```

A production version would use `bcrypt` (or `argon2`) to hash passwords at registration and compare hashes at sign-in.

### Roles stored in session cookie

The `role` cookie stores the highest-privilege role the user holds, using the priority `admin > owner > renter`. A user with `roles: ["renter", "owner"]` gets `role: "owner"` in their cookie, giving them access to both renter and owner routes.

A full roles array in the cookie or a JWT would be cleaner for more complex role hierarchies, but the current approach works correctly for this three-tier system.

### No pagination on dashboard pages

The renter dashboard, owner bookings page, and admin pages show all records without pagination. For the seed data (6 bookings, 4 users) this is fine. At scale, these pages would need server-side pagination.

### `unoptimized` on the car detail hero image

The car detail page (`/cars/[id]/page.js`) uses `unoptimized` on the `<Image>` component. This bypasses next/image's AVIF conversion for the hero photo. This was a fix applied to avoid a `400 Bad Request` error from the image optimizer. A production version would ensure all image paths are valid and remove the `unoptimized` flag.

---

## 3. The Production Migration Plan

In order of priority:

### Step 1 — Real Database

Replace `globalThis.__db` with a real database. The simplest path:

- **Neon** (PostgreSQL, serverless, free tier) + **Prisma** ORM
- Run `prisma migrate` to create tables matching the entity schemas in DATA.md
- Replace all `db.cars.filter(...)` reads with `prisma.car.findMany({...})`
- Replace all `db.cars.push(...)` writes with `prisma.car.create({...})`

The Server Component + Server Action architecture does not change — only `db.js` and `bookings.js` need to be updated.

### Step 2 — Password Hashing

```bash
npm install bcryptjs
```

At registration:
```js
const hash = await bcrypt.hash(password, 12);
// store hash, not password
```

At sign-in:
```js
const match = await bcrypt.compare(password, user.passwordHash);
if (!match) return { error: "Incorrect username or password." };
```

### Step 3 — Photo Upload

Add a file input to the car listing form. On submit, upload to Vercel Blob:

```js
import { put } from "@vercel/blob";
const blob = await put(file.name, file, { access: "public" });
car.photos = [blob.url];
```

### Step 4 — Payment Integration

Replace the mock checkout with a real Chapa or Stripe integration. The `placeBooking` Server Action would:
1. Create a payment intent
2. Redirect to the payment provider's hosted page
3. Handle the webhook callback to confirm the booking

### Step 5 — Email Notifications

Add `resend` for transactional emails:

```js
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({
  from: "noreply@sheggar.et",
  to: owner.email,
  subject: "New booking request",
  ...
});
```

Send from `placeBooking` (to owner), `confirmBookingAction` (to renter), and `cancelBookingAction` (to both).

### Step 6 — Full Roles in Session

Replace the single `role` cookie with a JWT that encodes the full `roles` array, or store the session in the database and look up roles on every request via `getSession()`.

---

## 4. Summary Table

| Item | Current state | Production fix |
| :--- | :--- | :--- |
| Database | `globalThis.__db` (resets on restart) | Neon + Prisma |
| Passwords | Plaintext | bcrypt hash |
| Payments | Mocked | Chapa / Stripe |
| Photo upload | Local `public/cars/` (works in dev) | Vercel Blob |
| Notifications | None | Resend (email) |
| Real-time status | None | SWR polling |
| Dispute filing UI | ✅ Implemented | — |
| Roles in session | Highest-privilege role stored | JWT with full roles array |
| Image optimization | AVIF + WebP via next/image | Already production-ready |
| Pagination | None on dashboards | Server-side cursor pagination |
| Unauthorized page | ✅ Implemented at `/unauthorized` | — |
| Profile page | ✅ Implemented at `/profile` | — |
