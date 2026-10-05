# Authentication & Authorization Architecture

This document outlines the layers of security implemented in the Addis Eats application, answering the security audit questions.

## 1. Cookie Security

- **Question:** Can any script on your page read the session cookie?
- **Answer:** No. The session cookie is set with `httpOnly: true` in `src/lib/session.js`. This prevents JavaScript (and therefore XSS attacks) from accessing the cookie via `document.cookie`.

## 2. Order Ownership (IDOR Protection)

- **Question:** Does the orders page work if you change the id in the URL to someone else's?
- **Answer:** No. In `src/app/orders/[id]/page.js`, the server checks `order.customerId === session.userId`. If the user is not the owner (and not staff), the page returns `notFound()` (404). The `cancelOrder` action in `src/app/actions.js` performs the same check.

## 3. Middleware Matcher

- **Question:** Does middleware run on your image files?
- **Answer:** No. The `config.matcher` in `src/middleware.js` is restricted to `["/checkout/:path*", "/orders/:path*", "/kitchen/:path*"]`. It does not run on static assets, improving performance.

## 4. Attack Analysis

- **Attack 1: XSS Cookie Theft** — Stopped by `httpOnly: true` in `src/lib/session.js`.
- **Attack 2: IDOR on Orders** — Stopped by `if (!isOwner && !isStaff) { notFound(); }` in `src/app/orders/[id]/page.js`.
- **Attack 3: Privilege Escalation on /kitchen** — Stopped by the `role !== "staff"` check in `src/middleware.js` and the `session.role !== "staff"` check in `src/app/kitchen/page.js`.

## 5. Staff Route Protection

- **Question:** Is the staff link merely hidden, or actually refused server-side?
- **Answer:** Actually refused server-side. The middleware blocks non-staff users at the edge, and the `/kitchen` page itself performs a secondary server-side check before rendering.

## 6. Signing Secret

- **Question:** Is your signing secret absent from the JavaScript the browser downloads?
- **Answer:** Yes. This application does not use JWT signing secrets. It uses `httpOnly` cookies to store the `userId` and `role`. The server validates these on every request. No secrets are exposed to the client.

## ⚠️ Security Note on Passwords

Passwords are stored in plaintext in `src/lib/users.js` for **demonstration purposes only**. A production application must hash passwords using a library like `bcrypt` or `argon2`.
