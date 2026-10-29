# AUTH.md — Authentication, Authorization, and Attack Verification

Every protected route, every role check, and the exact line of code that stops each attack.

---

## 1. How Authentication Works

Sign-in sets two `httpOnly` cookies:

```js
// src/lib/session.js
cookieStore.set("session", userId, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
});
cookieStore.set("role", role, { /* same flags */ });
```

`httpOnly: true` means JavaScript in the browser cannot read these cookies. XSS cannot steal the session.

`getSession()` reads the cookies on the server:

```js
// src/lib/session.js
export async function getSession() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("session")?.value;
  const role   = cookieStore.get("role")?.value;
  if (!userId) return null;
  return { userId, role: role || "renter" };
}
```

---

## 2. Roles

| Role | Who has it | What they can access |
| :--- | :--- | :--- |
| `renter` | Default for all signed-in users | `/dashboard`, `/bookings`, `/checkout` |
| `owner` | Users who list cars | Everything a renter can + `/owner/*` |
| `admin` | Platform staff only | Everything + `/admin/*` |

A user can have multiple roles (e.g. `["renter", "owner"]`). The `role` cookie stores only the primary role (the first in the array).

---

## 3. Route Protection Table

| Route | Protected by | What each layer proves |
| :--- | :--- | :--- |
| `/` | Nothing | Public. Indexable. |
| `/cars` | Nothing | Public. Cacheable. |
| `/cars/[id]` | Nothing | Public. `notFound()` if not approved. |
| `/signin` | Nothing | Public — exists to grant sessions. |
| `/signup` | Nothing | Public — creates renter accounts. |
| `/unauthorized` | Nothing | Public — anyone can land here. |
| `/profile` | Proxy + Server Component | Cookie exists. `getSession()` re-checks. |
| `/checkout` | Proxy + Server Component | Cookie exists AND car is approved AND renter ≠ owner. |
| `/dashboard` | Proxy + Server Component | Cookie exists. `getSession()` re-checks. |
| `/bookings` | Proxy + Server Component | Cookie exists. Queries scoped to `session.userId`. |
| `/bookings/[id]` | Proxy + Server Component | Cookie exists AND `booking.renterId === session.userId`. |
| `/owner/*` | Proxy + Server Component | Cookie exists AND `role === "owner"` or `"admin"`. |
| `/admin/*` | Proxy + Server Component | Cookie exists AND `role === "admin"`. |

**Why two layers?** The proxy (`src/proxy.js`) checks the cookie but cannot read the database — it only proves a cookie exists. The Server Component re-checks ownership by querying `db.*`. These are independent: if either fails, the request is refused.

---

## 4. The Proxy (`src/proxy.js`)

Runs before any page renders. Reads both cookies and redirects if the rule is not satisfied:

```js
const PROTECTED = [
  { prefix: "/admin",     role: "admin" },
  { prefix: "/owner",     role: "owner" },
  { prefix: "/dashboard", role: "renter" },
  { prefix: "/bookings",  role: "renter" },
  { prefix: "/checkout",  role: "renter" },
];

export async function proxy(request) {
  const rule = PROTECTED.find((r) => pathname.startsWith(r.prefix));
  if (!rule) return NextResponse.next();

  const userId = cookieStore.get("session")?.value;
  const role   = cookieStore.get("role")?.value;

  if (!userId) { /* redirect to /signin?next=<path> */ }
  if (rule.role === "admin" && role !== "admin") { /* redirect to /unauthorized */ }
  if (rule.role === "owner" && role !== "owner" && role !== "admin") { /* redirect to /unauthorized */ }

  return NextResponse.next();
}
```

---

## 5. Server Action Authorization

Every Server Action re-checks the session before touching the database. Middleware is not enough — a Server Action can be called directly via a POST request, bypassing the page route entirely.

Example — `cancelBookingAction`:

```js
// src/app/actions.js
export async function cancelBookingAction(bookingId) {
  const session = await getSession();          // Layer 1: signed in?
  if (!session) return { error: "Not signed in" };

  const result = cancelBooking(bookingId, session.userId); // Layer 2: ownership
  // Inside cancelBooking:
  //   if (actorId !== booking.renterId && actorId !== booking.ownerId)
  //     return { error: "Not yours" };
}
```

---

## 6. The Three Attacks

Each attack was called live and refused. The exact line that stopped each is listed.

### Attack 1 — Signed-out visitor calls `cancelBookingAction("bk-1")`

A logged-out user calls the Server Action directly.

Expected: Refused. Not a crash.

Result: Refused.

Line that stopped it:

```js
// src/app/actions.js — cancelBookingAction
const session = await getSession();
if (!session) return { error: "Not signed in" };
```

`getSession()` reads the httpOnly cookie. No cookie → `null` → early return before the database is touched.

---

### Attack 2 — Signed in as `yohannes` (renter), calls `confirmBookingAction("bk-1")`

`bk-1` belongs to owner `dawit`. `yohannes` is signed in with a valid session, but is not the car owner.

Expected: Refused on ownership. Not on session.

Result: Refused.

Line that stopped it:

```js
// src/lib/bookings.js — confirmBooking
if (actorId !== booking.ownerId && !isAdminActor) {
  return { error: "Only the car owner can confirm" };
}
```

The session is valid. The booking exists. The check fails because `yohannes`'s id does not match `booking.ownerId`. The error message is specific to the ownership failure, not the session.

---

### Attack 3 — Crafted sign-in redirect: `/signin?next=https://evil.com`

A malicious link carries an external URL in the `next` parameter. After sign-in, the victim should land on `/`, not `https://evil.com`.

Expected: Lands on `/`.

Result: Lands on `/`.

Line that stopped it:

```js
// src/app/actions.js — signIn
const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
redirect(safeNext);
```

`https://evil.com` does not start with `/` → `safeNext = "/"`.
`//evil.com` starts with `/` but also starts with `//` → `safeNext = "/"`.

Both classic open-redirect bypasses are blocked by the two-condition check.

---

## 7. What Each Layer Does NOT Prove

- The proxy does NOT prove the cookie maps to a real, active user. It only proves a cookie value exists.
- A page-level `getSession()` call does NOT protect a Server Action. Actions must re-check independently.
- Hiding a button in the UI proves nothing. Every action checks authorization regardless of whether the UI exposed the button.
- A scoped query in one page does NOT protect other pages or API-equivalent routes.

Each layer is independent. Removing any one of them does not compromise the remaining layers.

---

## 8. Demo Accounts

| Username | Password | Role |
| :--- | :--- | :--- |
| `dawit` | `dawit2026` | renter + owner |
| `hanna` | `hanna2026` | renter + owner |
| `yohannes` | `yohannes2026` | renter |
| `admin` | `admin2026` | admin |

Use `dawit` to test owner flows. Use `yohannes` to verify ownership isolation. Use `admin` for the admin dashboard.

⚠️ Passwords are stored in plaintext. Demo only. See FUTURE.md for the bcrypt migration plan.
