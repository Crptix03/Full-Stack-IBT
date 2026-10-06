# AUTH.md — Authentication, Authorization, and Attack Verification

Every route, every action, its layers, and **what each layer actually proves**.
Plus the three attacks called live, and the exact line that refused each one.

---

## 1. Route Protection Table

| Route                | Who                | Protected By                                             | What Each Layer Proves                                                       |
| :------------------- | :----------------- | :------------------------------------------------------- | :--------------------------------------------------------------------------- |
| `/`                  | Everyone           | Nothing                                                  | Public. Indexable.                                                           |
| `/menu`              | Everyone           | Nothing                                                  | Public. Indexable. Cacheable.                                                |
| `/menu/[slug]`       | Everyone           | Nothing                                                  | Public. Indexable. JSON-LD per dish.                                         |
| `/cart`              | Everyone           | Nothing                                                  | Client store only — never leaves the browser.                                |
| `/checkout`          | Any signed-in user | Middleware + page                                        | A session cookie exists. The write re-checks.                                |
| `/checkout/success`  | Any signed-in user | Middleware + page                                        | A session cookie exists.                                                     |
| `/orders`            | **Owner only**     | Middleware + page + scoped query                         | Signed in **and** only their own rows.                                       |
| `/orders/[id]`       | Owner or staff     | Middleware + page + scoped query                         | Signed in, and the record is theirs (or staff).                              |
| `/api/orders/[id]`   | Owner or staff     | Route handler                                            | Same check as the page, at the API boundary.                                 |
| `/profile`           | Any signed-in user | Middleware + page                                        | A session cookie exists.                                                     |
| `/kitchen`           | **Staff only**     | Middleware + page + role check in every action           | Signed in **and** permitted.                                                 |
| `/signin`            | Everyone           | Nothing                                                  | Public — it exists to grant sessions.                                        |
| `/api/dishes`        | Everyone           | Nothing                                                  | Public API.                                                                  |
| `/api/dishes/[id]`   | Everyone           | Nothing                                                  | Public API.                                                                  |
| `/api/orders` (POST) | Any signed-in user | Unused in the UI — orders are created via server action. | —                                                                            |
| `/sitemap.xml`       | Everyone           | Nothing                                                  | Lists public routes only.                                                    |
| `/robots.txt`        | Everyone           | Nothing                                                  | Explicitly disallows `/cart`, `/checkout`, `/orders`, `/kitchen`, `/signin`. |

**The fourth column is the point.** "Protected by middleware" is not an answer. Middleware only proves a cookie exists. It does not prove:

- The cookie is valid for a real user.
- The user owns the record they are reading.
- The user has the role required for the action.

Every one of those must be re-checked where it matters — in the page, and again in the write.

---

## 2. Layered Defense per Route — Example: /orders/[id]

The `/orders/[id]` route is protected by five independent layers. Each one proves something the others cannot:

- middleware — proves a cookie exists (src/middleware.js)
- page — proves the session is valid (src/app/orders/[id]/page.js)
- page — proves the record belongs to the session user (same file, isOwner check)
- api route — proves the same at the API boundary (src/app/api/orders/[id]/route.js)
- action — re-checks ownership before writing (src/app/actions.js -> cancelOrder)

Every layer is independent. If any one is removed, the record is still safe.

---

## 3. The Three Attacks

Each attack was called live and refused. The specific line that stopped each is listed.

### Attack 1 — Signed out: cancelOrder("ord_812")

Scenario: A logged-out visitor calls cancelOrder with an arbitrary order id.

Expected: Refused. Not a crash.

Result: Refused.

Line that stopped it:

    // src/app/actions.js
    const session = await getSession();
    if (!session) {
      return { error: "You must be signed in to cancel an order." };
    }

### Attack 2 — Signed in as someone else

Scenario: User alex is signed in and calls cancelOrder with customer's order id. The session is valid. The id is valid. But the order belongs to someone else.

Expected: Refused on ownership, not on session. The message must make clear it's about the record.

Result: Refused.

Line that stopped it:

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

### Attack 3 — Crafted sign-in link: /signin?next=https://example.com

Scenario: A malicious link carries an external URL in the next parameter. After sign-in, the victim should be sent to /, not to example.com.

Expected: Lands on /, not example.com.

Result: Lands on /.

Line that stopped it:

    // src/app/actions.js
    const safeNext =
      next.startsWith("/") && !next.startsWith("//") ? next : "/";

The startsWith("/") check rejects absolute URLs.
The !startsWith("//") check rejects protocol-relative URLs (//evil.com), which some browsers treat as same-protocol — a classic bypass if only the first check exists.

---

## 4. Cookies

The session cookie is set in src/lib/session.js:

    cookieStore.set(COOKIE_NAME, userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

| Flag                      | What it proves                                                      |
| :------------------------ | :------------------------------------------------------------------ |
| httpOnly: true            | Client-side JavaScript cannot read the cookie. XSS cannot steal it. |
| secure: true (production) | Only sent over HTTPS. Cannot be intercepted on plain HTTP.          |
| sameSite: "lax"           | Not sent on cross-site POST requests. CSRF mitigation.              |
| path: "/"                 | Available to all routes.                                            |
| maxAge: 7 days            | Session expires automatically.                                      |

---

## 5. What Each Layer Does NOT Prove

- Middleware does NOT prove the cookie is valid or that it maps to a real user. It only reads the cookie value.
- A page check does NOT protect a write. The action must re-check ownership.
- A UI check (like hiding a button) proves nothing. The action must refuse even if called directly.
- A scoped query in the page does NOT protect the API. The API must scope independently.

Every layer here was built knowing what the others cannot do.
