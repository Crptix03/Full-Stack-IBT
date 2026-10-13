# AUTH.md — Authentication, Authorization, and Attack Verification

Every route, every action, its layers, and what each layer actually proves.
Plus the three attacks called live, and the exact line that refused each one.

---

## 1. Two Sign-In Paths, One Session Shape

The app supports two ways to sign in. Both produce the same `{ userId, role, username, provider }` shape from `getSession()` — so every downstream check works identically.

| Provider   | How the user signs in                        | Session cookie                            | userId format             |
| :--------- | :------------------------------------------- | :---------------------------------------- | :------------------------ |
| **demo**   | Username/password against `src/lib/users.js` | `session` + `role` (both httpOnly)        | `u-chef`, `u-abebe`, etc. |
| **google** | Google OAuth via NextAuth v5                 | `authjs.session-token` (NextAuth-managed) | `g-<google-sub>`          |

The `provider` field on the session tells the app which path was used. `layout.js`, `actions.js`, and `profile/page.js` all use a shared `resolveUser()` helper to handle both.

---

## 2. Route Protection Table

| Route                     | Who                | Protected By                                   | What Each Layer Proves                                                       |
| :------------------------ | :----------------- | :--------------------------------------------- | :--------------------------------------------------------------------------- |
| `/`                       | Everyone           | Nothing                                        | Public. Indexable.                                                           |
| `/menu`                   | Everyone           | Nothing                                        | Public. Indexable. Cacheable.                                                |
| `/menu/[slug]`            | Everyone           | Nothing                                        | Public. Indexable. JSON-LD per dish.                                         |
| `/cart`                   | Everyone           | Nothing                                        | Client store only — never leaves the browser.                                |
| `/signin`                 | Everyone           | Nothing                                        | Public — it grants sessions. Shows both Google and demo options.             |
| `/checkout`               | Any signed-in user | Middleware + page                              | A session cookie exists. The write re-checks.                                |
| `/checkout/success`       | Any signed-in user | Middleware + page                              | A session cookie exists.                                                     |
| `/orders`                 | **Owner only**     | Middleware + page + scoped query               | Signed in **and** only their own rows.                                       |
| `/orders/[id]`            | Owner or staff     | Middleware + page + scoped query               | Signed in, and the record is theirs (or staff).                              |
| `/track/[id]`             | Owner or staff     | Page + API route                               | Same check as `/orders/[id]`, plus an SSE stream that re-checks per message. |
| `/api/orders/[id]`        | Owner or staff     | Route handler                                  | Same check as the page, at the API boundary.                                 |
| `/api/orders/[id]/stream` | Owner or staff     | Route handler (SSE)                            | Session + ownership before the stream opens.                                 |
| `/profile`                | Any signed-in user | Middleware + page                              | A session cookie exists (either provider).                                   |
| `/kitchen`                | **Staff only**     | Middleware + page + role check in every action | Signed in **and** permitted.                                                 |
| `/dashboard`              | **Staff only**     | Middleware + page + role check in every action | Signed in **and** permitted.                                                 |
| `/api/dishes`             | Everyone           | Nothing                                        | Public API.                                                                  |
| `/api/orders` (GET)       | Any signed-in user | Route handler                                  | Returns only the session user's orders.                                      |
| `/api/orders` (POST)      | Any signed-in user | Route handler                                  | Creates an order scoped to the session user.                                 |
| `/api/auth/[...nextauth]` | Everyone           | NextAuth                                       | OAuth flow endpoints.                                                        |
| `/sitemap.xml`            | Everyone           | Nothing                                        | Lists public routes only.                                                    |
| `/robots.txt`             | Everyone           | Nothing                                        | Explicitly disallows `/cart`, `/checkout`, `/orders`, `/kitchen`, `/signin`. |

**The fourth column is the point.** "Protected by middleware" is not an answer. Middleware only proves **a cookie exists** — either the demo `session` cookie or a NextAuth cookie. It does not prove:

- The cookie is valid for a real user.
- The user owns the record they are reading.
- The user has the role required for the action.

Every one of those must be re-checked where it matters — in the page, and again in the write.

---

## 3. Layered Defense per Route — Example: /orders/[id]

The `/orders/[id]` route is protected by five independent layers:

- `middleware` — proves a cookie exists (either provider) in `src/middleware.js`
- `page` — proves the session is valid via `getSession()` in `src/app/orders/[id]/page.js`
- `page` — proves the record belongs to the session user (same file, `isOwner` check)
- `api route` — proves the same at the API boundary in `src/app/api/orders/[id]/route.js`
- `action` — re-checks ownership before writing in `src/app/actions.js` → `cancelOrder`

Every layer is independent. If any one is removed, the record is still safe.

---

## 4. The Three Attacks

Each attack was called live and refused. The specific line that stopped each is listed.

### Attack 1 — Signed out: cancelOrder("ord_812")

**Scenario:** A logged-out visitor calls `cancelOrder` with an arbitrary order id.

**Expected:** Refused. Not a crash.

**Result:** Refused.

**Line that stopped it:**

    // src/app/actions.js
    const session = await getSession();
    if (!session) {
      return { error: "You must be signed in to cancel an order." };
    }

### Attack 2 — Signed in as someone else

**Scenario:** User `alex` is signed in and calls `cancelOrder` with `customer`'s order id. The session is valid. The id is valid. But the order belongs to someone else.

**Expected:** Refused on **ownership**, not on session.

**Result:** Refused.

**Line that stopped it:**

    // src/app/actions.js
    const isOwner = order.customerId === session.userId;
    const isStaff = session.role === "staff";

    if (!isOwner && !isStaff) {
      return { error: "You don't own this order." };
    }

The same check exists on the read path:

    // src/app/orders/[id]/page.js
    if (!isOwner && !isStaff) {
      notFound();
    }

And on the API:

    // src/app/api/orders/[id]/route.js
    if (!isOwner && !isStaff) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

And on the streaming endpoint:

    // src/app/api/orders/[id]/stream/route.js
    if (!isOwner && !isStaff) {
      return new Response("Forbidden", { status: 403 });
    }

### Attack 3 — Crafted sign-in link: /signin?next=https://example.com

**Scenario:** A malicious link carries an external URL in the `next` parameter. After sign-in, the victim should be sent to `/`, **not** to example.com.

**Expected:** Lands on `/`, not example.com.

**Result:** Lands on `/`.

**Line that stopped it:**

    // src/app/actions.js
    const safeNext =
      next.startsWith("/") && !next.startsWith("//") ? next : "/";

The `startsWith("/")` check rejects absolute URLs.
The `!startsWith("//")` check rejects protocol-relative URLs (`//evil.com`).

The same rule applies to the Google flow — the `callbackUrl` passed to `signIn("google", { callbackUrl: next })` is validated by the same logic in `signin/page.js`.

---

## 5. Cookies

### Demo sessions — `src/lib/session.js`

    cookieStore.set(COOKIE_NAME, userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

### Google sessions — managed by NextAuth

| Cookie                                                                    | Purpose                            |
| :------------------------------------------------------------------------ | :--------------------------------- |
| `authjs.session-token` (or `__Secure-authjs.session-token` in production) | The encrypted JWT session          |
| `authjs.csrf-token`                                                       | CSRF protection for the OAuth flow |
| `authjs.callback-url`                                                     | Where to redirect after sign-in    |

Both providers use `httpOnly` cookies. Both are unavailable to client-side JavaScript.

| Flag                        | What it proves                                              |
| :-------------------------- | :---------------------------------------------------------- |
| `httpOnly: true`            | Client-side JS cannot read the cookie. XSS cannot steal it. |
| `secure: true` (production) | Only sent over HTTPS.                                       |
| `sameSite: "lax"`           | Not sent on cross-site POST requests. CSRF mitigation.      |

---

## 6. What Each Layer Does NOT Prove

- **Middleware does NOT prove** the cookie is valid or that it maps to a real user. It only reads the cookie name.
- **A page check does NOT protect a write.** The action must re-check ownership.
- **A UI check (like hiding a button) proves nothing.** The action must refuse even if called directly.
- **A scoped query in the page does NOT protect the API.** The API must scope independently.
- **The `provider` field does NOT grant extra permissions.** A Google user is a customer by default. Staff-only routes check `session.role === "staff"` regardless of provider.

Every layer here was built knowing what the others cannot do.
