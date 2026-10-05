# Rendering Strategy

Every route in Addis Eats on Next.js, its rendering strategy, and one line of reasoning.

## Recorded build output

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

## Strategy per route

| Route               | Strategy                             | Why                                                                                                                                                                                  |
| ------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`                 | Static (`○`)                         | Same landing page for every visitor — nothing user-specific.                                                                                                                         |
| `/menu`             | Static + ISR (`○`, `revalidate: 1h`) | Dishes change rarely. Static speed with hourly background refresh.                                                                                                                   |
| `/menu/[slug]`      | SSG (`●`)                            | `generateStaticParams` returns all 4 known slugs. Next.js prerenders 4 pages at build time.                                                                                          |
| `/cart`             | Static shell (`○`)                   | Cart lives in client state. The page shell is identical for everyone; only the client component inside changes.                                                                      |
| `/checkout`         | Dynamic (`ƒ`)                        | Forced with `export const dynamic = "force-dynamic"`. In a real app it reads the session cookie for the guard; even without that, per-request is the honest strategy for a checkout. |
| `/checkout/success` | Dynamic (`ƒ`)                        | Reads `searchParams.id` at request time — cannot be prerendered.                                                                                                                     |
| `/api/dishes`       | Dynamic (`ƒ`)                        | Route handler. Always per-request.                                                                                                                                                   |
| `/api/dishes/[id]`  | Dynamic (`ƒ`)                        | Route handler with a dynamic segment.                                                                                                                                                |
| `/api/orders`       | Dynamic (`ƒ`)                        | Route handler with a POST body.                                                                                                                                                      |

## Special files

| File                    | Purpose                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| `app/layout.js`         | Root shell — `<html>`, `<body>`, header, nav, footer.                                         |
| `app/loading.js`        | Suspense fallback for the root segment.                                                       |
| `app/error.js`          | Error boundary at the root — catches thrown render errors.                                    |
| `app/not-found.js`      | Global 404 UI.                                                                                |
| `app/menu/loading.js`   | Suspense fallback for `/menu`. Shows on slow connections.                                     |
| `app/menu/error.js`     | Error boundary scoped to the menu segment — a broken menu doesn't blank the header or footer. |
| `app/menu/not-found.js` | Rendered when `notFound()` is called in `/menu/[slug]` for an unknown slug.                   |

## The four decisions

### 1. Folder tree

The folder structure **is** the routing. No separate router config. Decisions on paper first:

```
app/
├── layout.js           root shell
├── page.js             / (static landing)
├── loading.js
├── error.js
├── not-found.js
├── menu/
│   ├── layout.js       nested layout (category sidebar)
│   ├── page.js         /menu (ISR)
│   ├── loading.js
│   ├── error.js
│   ├── not-found.js
│   ├── CategoryBar.jsx    client
│   ├── FilterShell.jsx    client
│   ├── AddToCartButton.jsx client
│   ├── DishList.jsx       server
│   ├── slug.js            pure
│   └── [slug]/
│       └── page.jsx       /menu/kitfo (SSG)
├── cart/
│   └── page.js            /cart (client)
├── checkout/
│   ├── page.js            /checkout (server shell, dynamic)
│   ├── CheckoutForm.jsx   client
│   └── success/
│       ├── page.js        /checkout/success (dynamic)
│       └── ClearCartOnMount.jsx client
├── api/
│   ├── dishes/
│   │   ├── route.js
│   │   └── [id]/route.js
│   └── orders/route.js
└── actions.js          placeOrder + cancelOrder

lib/
├── dishes.js           getDishes() — async data source
├── orders.js           in-memory orders store
├── providers.jsx       cart context (shared — sits outside app/)
└── schema.js           Zod schema (shared by form and server)
```

**Shared code — anything used by more than one route — lives in `lib/`, outside `app/`.** That's why `providers.jsx` is at `lib/providers.jsx` rather than `app/providers.jsx`, even though it's imported by `app/layout.js`.

### 2. Layout nesting

Two layouts:

- `app/layout.js` — the root shell. Owns `<html>`, `<body>`, header, footer. Persists across every navigation.
- `app/menu/layout.js` — nested sidebar layout. Applies to `/menu` and `/menu/[slug]`. The sidebar persists across navigation into a dish detail page — the browser does not re-render it.

### 3. Rendering strategy per route

See the table above. The decision rule:

| Ask of every route        | Answer                        |
| ------------------------- | ----------------------------- |
| Who is asking?            | Nobody in particular → static |
| How stale may it be?      | An hour → `revalidate = 3600` |
| Do I know the ids?        | Yes → `generateStaticParams`  |
| Does it read a cookie?    | Yes → dynamic                 |
| Is it private to one tab? | Yes → render on the client    |

### 4. Client boundary

See `BOUNDARY.md`. Nine client components inside the pages, plus two error boundaries required by Next.js.

## What I changed my mind about

**Initial plan:** `/checkout` as static — a client-only form with no server data.

**What changed:** The justification question ("does it read a cookie?") forced a re-think. Even without real auth today, a checkout route is conceptually per-request — it belongs behind a session check. I split the page into:

- `app/checkout/page.js` — a Server Component with `export const dynamic = "force-dynamic"`
- `app/checkout/CheckoutForm.jsx` — the interactive client form

The build output now shows `/checkout` as `ƒ` (Dynamic), matching the intent. ✅

## Verification

Route markers in the build output match this document one-to-one. Any disagreement would mean either a bug or an unthought decision.

Six mechanical checks, all passing:

1. `npm run build` succeeds and produces the expected route table ✅
2. Every route marker matches the written intent ✅
3. `"use client"` count matches `BOUNDARY.md` ✅
4. `curl` against `/api/orders` returns 422 with `fieldErrors.customerName` for a bad name ✅
5. Same command returns 422 with `fieldErrors.phone` for a bad phone ✅
6. Same command returns 201 with an order object for a valid request ✅

## Bundle analysis

Route sizes stay small because dishes render on the server — nothing for the menu list ships to the client. Only the interactive leaves (`CategoryBar`, `FilterShell`, `AddToCartButton`) add to First Load JS.

Exact numbers captured via `npm run build`.
