# Addis Eats — Next.js Port

The Day 35 Addis Eats food-ordering app, rebuilt on Next.js 16 with the App Router. Same domain, new architecture — file-based routing, nested layouts, a deliberate rendering strategy per route, server components fetching their own data, and route handlers + server actions behind them.

## Live preview

Not deployed. Run locally:

```bash
npm install
npm run dev
```

Open **http://localhost:3000**.

---

## Features

### Customer side

- **Home** — static landing page
- **Menu** — dish list with category sidebar (ISR, revalidates hourly)
- **Dish detail** — one page per dish, statically generated from `generateStaticParams`
- **Add to cart** — client-side state via React Context
- **Cart** — quantities, running total, remove item
- **Checkout** — form with server-side validation
- **Order confirmation** — thank-you page with order ID

### Server side

- **`GET /api/dishes`** — list all dishes
- **`GET /api/dishes/[id]`** — one dish, 404 for unknown ids
- **`POST /api/orders`** — place an order, validated server-side
- **`placeOrder` server action** — called by the checkout form
- **`cancelOrder` server action** — placeholder for future auth-guarded cancellation

---

## Endpoints

| Method | Path               | Purpose         | Status codes |
| ------ | ------------------ | --------------- | ------------ |
| GET    | `/api/dishes`      | List all dishes | 200          |
| GET    | `/api/dishes/[id]` | One dish by id  | 200, 404     |
| POST   | `/api/orders`      | Place an order  | 201, 422     |

### Example — valid order (returns 201)

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d @test-order.json
```

**Response:**

```json
{
  "id": "order-1790522966875",
  "customerName": "Abebe Kebede",
  "phone": "0912345678",
  "address": "Bole Road, Addis Ababa",
  "items": [{ "id": "d1", "name": "Crispy Sambusa", "price": 100, "qty": 1 }],
  "status": "pending"
}
```

### Example — invalid name (returns 422 with fieldErrors)

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d @test-order-invalid.json
```

**Response:**

```json
{
  "fieldErrors": {
    "customerName": ["Please enter a valid name (letters only, no numbers)"]
  }
}
```

### Example — invalid phone (returns 422)

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d @test-order-badphone.json
```

**Response:**

```json
{
  "fieldErrors": {
    "phone": ["Enter a valid Ethiopian number"]
  }
}
```

---

## Route map

| Route               | File                           | Rendering                      |
| ------------------- | ------------------------------ | ------------------------------ |
| `/`                 | `app/page.js`                  | Static (`○`)                   |
| `/menu`             | `app/menu/page.js`             | ISR — `revalidate = 3600`      |
| `/menu/[slug]`      | `app/menu/[slug]/page.jsx`     | SSG — `generateStaticParams`   |
| `/cart`             | `app/cart/page.js`             | Static shell + client          |
| `/checkout`         | `app/checkout/page.js`         | Dynamic — `force-dynamic`      |
| `/checkout/success` | `app/checkout/success/page.js` | Dynamic — reads `searchParams` |
| `/api/dishes`       | `app/api/dishes/route.js`      | Route handler                  |
| `/api/dishes/[id]`  | `app/api/dishes/[id]/route.js` | Route handler                  |
| `/api/orders`       | `app/api/orders/route.js`      | Route handler                  |

---

## Build output

```
   ▲ Next.js 16.3.5 (Turbopack)

   Creating an optimized production build ...
 ✓ Compiled successfully in 2.6s
 ✓ Finished TypeScript in 3ms
 ✓ Collecting page data using 13 workers in 854ms
 ✓ Generating static pages using 13 workers (13/13) in 657ms
 ✓ Finalizing page optimization in 18ms

Route (app)                    Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ƒ /api/dishes
├ ƒ /api/dishes/[id]
├ ƒ /api/orders
├ ○ /cart
├ ƒ /checkout
├ ƒ /checkout/success
├ ○ /menu                          1h        1y
└ ● /menu/[slug]
    ├ /menu/crispy-sambusa
    ├ /menu/steak-and-fries
    ├ /menu/big-smokey-burger
    └ /menu/honey-baklava

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

**Marker legend:**

- `○` — Static: prerendered at build time
- `●` — SSG: prerendered with `generateStaticParams`
- `ƒ` — Dynamic: server-rendered on demand

---

## Project structure

```
addis_eats/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── dishes/
│   │   │   │   ├── route.js
│   │   │   │   └── [id]/route.js
│   │   │   └── orders/route.js
│   │   ├── cart/
│   │   │   └── page.js
│   │   ├── checkout/
│   │   │   ├── page.js             server shell
│   │   │   ├── CheckoutForm.jsx    client form
│   │   │   └── success/
│   │   │       ├── page.js
│   │   │       └── ClearCartOnMount.jsx
│   │   ├── menu/
│   │   │   ├── [slug]/
│   │   │   │   └── page.jsx
│   │   │   ├── AddToCartButton.jsx client
│   │   │   ├── CategoryBar.jsx     client
│   │   │   ├── DishList.jsx        server
│   │   │   ├── FilterShell.jsx     client
│   │   │   ├── error.js
│   │   │   ├── layout.js           nested layout
│   │   │   ├── loading.js
│   │   │   ├── not-found.js
│   │   │   ├── page.js
│   │   │   └── slug.js
│   │   ├── actions.js              Server Actions
│   │   ├── error.js                Root boundary
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.js               Root shell
│   │   ├── loading.js
│   │   ├── not-found.js
│   │   └── page.js
│   └── lib/
│       ├── dishes.js               getDishes() — async data
│       ├── orders.js               in-memory orders store
│       ├── providers.jsx           Cart context
│       └── schema.js               Zod schema (form + server share)
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── test-order.json                 curl test fixtures
├── test-order-invalid.json
├── test-order-badphone.json
├── STRATEGY.md                     Rendering strategy per route
├── BOUNDARY.md                     Client/server boundary map
└── README.md
```

---

## Documentation

- **[`STRATEGY.md`](./STRATEGY.md)** — every route, its rendering strategy, one line of reasoning.
- **[`BOUNDARY.md`](./BOUNDARY.md)** — every component, which side it runs on, and why.

Both are considered deliverables — they record the **decisions** that produced the code.

---

## Key architecture decisions

### Routing

File-based via the App Router. The folder tree **is** the routing — no separate config.

### Layouts

- **Root layout** — owns `<html>`, `<body>`, header, footer. Persists across all navigation.
- **Menu layout** — nested. The category sidebar persists when navigating from `/menu` into `/menu/[slug]`.

### Rendering strategy

| Route type                  | Strategy                                         |
| --------------------------- | ------------------------------------------------ |
| Content that doesn't change | Static                                           |
| Content that changes rarely | ISR (`revalidate`)                               |
| Content with known ids      | SSG (`generateStaticParams`)                     |
| Per-request content         | Dynamic (`force-dynamic` or `searchParams` read) |

Full reasoning in `STRATEGY.md`.

### Client boundary

The three truly unavoidable client components are `lib/providers.jsx` (cart state), `CategoryBar` (onClick), and `AddToCartButton` (mutation). The rest are either Next.js requirements (`error.js`) or mechanical splits (`CheckoutForm`). Full map in `BOUNDARY.md`.

### Where `providers.jsx` lives

`providers.jsx` is at `lib/providers.jsx`, not `app/providers.jsx`. It's shared code (used by every consumer of `useCart` across multiple routes), which per the PDF's rule belongs in `lib/`. `app/` stays limited to routes and route-specific components.

### Validation

One Zod schema (`lib/schema.js`) is used by **both** the form and the server action. The API route validates the same way. Attack vector: `curl` with an invalid body still gets a 422.

---

## Scripts

```bash
npm run dev       # dev server on http://localhost:3000
npm run build     # production build — prints the route table
npm run start     # serve the production build
npm run lint      # run ESLint
```

### Verifying the build

```bash
npm run build
```

Look at the route table in the output. Every marker should match `STRATEGY.md`. If it doesn't, either the code or the doc has a bug.

### Verifying the endpoints

```bash
# Valid order → 201 + order object
curl.exe -X POST http://localhost:3000/api/orders -H "Content-Type: application/json" -d "@test-order.json"

# Invalid name → 422 + fieldErrors.customerName
curl.exe -X POST http://localhost:3000/api/orders -H "Content-Type: application/json" -d "@test-order-invalid.json"

# Invalid phone → 422 + fieldErrors.phone
curl.exe -X POST http://localhost:3000/api/orders -H "Content-Type: application/json" -d "@test-order-badphone.json"

# Unknown dish → 404
curl.exe http://localhost:3000/api/dishes/xyz
```

---

## Tech stack

- **Next.js 16** — App Router
- **React 18** — Server Components + Client Components
- **Zod** — schema validation (shared between form and server)
- **Tailwind CSS** — utility styling
- **Turbopack** — bundler (default for Next.js 16)

---

## Known limitations

- **In-memory orders.** `lib/orders.js` is an array that resets on server restart. A production app would use a database.
- **No real auth.** `cancelOrder` checks a session cookie that is never set. The check is correct in shape but not yet wired to a real login.
- **No persistence for cart.** Cart resets on page refresh — intentional for the exercise.
- **The `test-order*.json` files are curl fixtures**, not production code.

---

## About

Built as the Day 40 project for a React/Next.js module. Draws on Days 35–39 of the same course:

| Day | What it contributed                                       |
| --- | --------------------------------------------------------- |
| 35  | Original Addis Eats domain and cart logic                 |
| 36  | File-based routing, dynamic segments, loading/error files |
| 37  | Nested layouts, deliberate rendering strategy per route   |
| 38  | Server components fetching data; `"use client"` on leaves |
| 39  | Route handlers, server actions, server-side validation    |

Two documents — `STRATEGY.md` and `BOUNDARY.md` — capture the architecture decisions that produced this build.
