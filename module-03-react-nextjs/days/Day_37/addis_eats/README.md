# Addis Eats — Next.js App Router

A Next.js (App Router) port of the Addis Eats restaurant app, focused on **layouts** and **rendering strategies**.

Every route uses a deliberate rendering strategy — static, ISR, or dynamic — documented per route in `STRATEGY.md`.

Built with **Next.js 16** using the App Router.

---

## Route map

Every URL is produced by a `page.js` (or `page.jsx`) file inside `src/app/`. The folder path **is** the URL path.

| Route        | File that produces it        | Rendering strategy     |
| ------------ | ---------------------------- | ---------------------- |
| `/`          | `src/app/page.js`            | Static (`○`)           |
| `/cart`      | `src/app/cart/page.js`       | Static (`○`)           |
| `/checkout`  | `src/app/checkout/page.js`   | Dynamic (`ƒ`)          |
| `/menu`      | `src/app/menu/page.js`       | Static + ISR (`○`, 1h) |
| `/menu/[id]` | `src/app/menu/[id]/page.jsx` | SSG (`●`, 4 paths)     |

Legend:

- **Static (`○`)** — prerendered as HTML at build time.
- **Static + ISR (`○`)** — prerendered, then revalidated in the background at `revalidate`'s interval.
- **SSG (`●`)** — dynamic route with `generateStaticParams` producing N static pages.
- **Dynamic (`ƒ`)** — server-rendered on every request.

See `STRATEGY.md` for the full rationale per route.

---

## Project structure

```
Day_37/addis_eats/
├── .next/                         # build output (auto-generated)
├── node_modules/
├── public/
│   └── favicon.ico
├── src/
│   └── app/
│       ├── cart/
│       │   └── page.js            # /cart
│       ├── checkout/
│       │   └── page.js            # /checkout (force-dynamic)
│       ├── menu/
│       │   ├── [id]/
│       │   │   └── page.jsx       # /menu/d1, /menu/d2, … (generateStaticParams)
│       │   ├── CategoryBar.jsx    # sidebar client component
│       │   ├── DishList.jsx       # dish list component
│       │   ├── error.js           # error UI for /menu segment (client)
│       │   ├── layout.js          # nested sidebar layout
│       │   ├── loading.js         # route loading state
│       │   ├── not-found.js       # dish-not-found UI
│       │   └── page.js            # /menu (revalidate + Suspense)
│       ├── favicon.ico
│       ├── globals.css            # global stylesheet
│       ├── layout.js              # root layout (html, body, header, footer)
│       └── page.js                # / (home)
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
└── STRATEGY.md                    # per-route rendering strategy
```

---

## Layouts

### Root layout — `src/app/layout.js`

The root shell that wraps every page. Owns:

- `<html>` and `<body>`
- Global CSS import (`globals.css`)
- Header with navigation links (`/menu`, `/cart`, `/checkout`)
- Footer with copyright
- Metadata (title, description)

Because it's the root layout, it **persists across every navigation** — the header and footer never unmount.

### Menu layout — `src/app/menu/layout.js`

A **nested** layout that only applies to `/menu/*` routes. Renders:

- A category sidebar (`CategoryBar`)
- The page content as `{children}`

Because Next.js preserves nested layouts across client-side navigation, the sidebar **does not re-render** when moving from `/menu` into a dish detail page — only the main content swaps.

---

## Rendering strategy at a glance

| Route        | Strategy      | Trigger                                  |
| ------------ | ------------- | ---------------------------------------- |
| `/`          | Static        | Default — no dynamic data                |
| `/cart`      | Static        | Client state only                        |
| `/checkout`  | Dynamic       | `export const dynamic = "force-dynamic"` |
| `/menu`      | Static + ISR  | `export const revalidate = 3600`         |
| `/menu/[id]` | SSG (4 paths) | `generateStaticParams`                   |

Full reasoning in `STRATEGY.md`.

---

## Streaming

`/menu` wraps its dish list in a `<Suspense>` boundary:

```jsx
<Suspense fallback={<p>Loading dishes…</p>}>
  <DishesAsync />
</Suspense>
```

The page shell and sidebar render immediately; the dish list streams in when its
data resolves. Users see structure right away instead of a blank screen.

---

## Special files in the App Router

Only `page.js` files create routes. Everything else has a specific purpose:

| File             | Purpose                                                        |
| ---------------- | -------------------------------------------------------------- |
| `layout.js`      | Wraps children in a shared layout (persists across navigation) |
| `page.js`        | Defines a **route**                                            |
| `loading.js`     | Suspense fallback while the segment loads                      |
| `error.js`       | Error boundary for the segment (must be a Client Component)    |
| `not-found.js`   | UI shown when `notFound()` is called                           |
| Any other `.jsx` | Regular component — not routable                               |

---

## Scripts

```bash
npm run dev     # start the dev server on http://localhost:3000
npm run build   # production build — prints the full route table
npm run start   # serve the production build
npm run lint    # run ESLint
```

### Verify the build

```bash
npm run build
```

Expected output (abridged):

```
Route (app)                              Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ○ /cart
├ ƒ /checkout
├ ○ /menu                                    1h        1y
└ ● /menu/[id]
    ├ /menu/d1
    ├ /menu/d2
    ├ /menu/d3
    └ /menu/d4

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

---

## Notes

- **Folder casing matters.** This project uses lowercase URL segments (`menu`, `cart`, `checkout`) because Next.js maps folder names directly to URLs.
- **`params` is async on Next 15+.** In `menu/[id]/page.jsx`, `params` must be awaited before reading `id`.
- **Only `page.js` files become routes.** Other files inside `app/` are components or special files.
- **`loading.js` and Suspense only visibly fire in production** (`npm run build && npm run start`), not in `npm run dev`.
- **`error.js` must be a client component.** It requires `"use client";` at the top.

---

## Summary

This project demonstrates:

- A real root layout with header, footer, and global styles
- A nested menu layout with a persistent sidebar
- Static, ISR, SSG, and dynamic routes — each chosen deliberately
- Streaming via `Suspense` so slow data never blocks the page shell
- Loading, error, and not-found states scoped to the right segments
- A per-route rendering strategy documented in `STRATEGY.md`
