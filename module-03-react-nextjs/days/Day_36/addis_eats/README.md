# Addis Eats — Next.js App Router

A Next.js (App Router) port of the Addis Eats restaurant app. This version focuses on the **route tree built from folders** — with loading, error, and not-found states per segment.

Built with **Next.js 16** using the App Router.

---

## Route map

Every URL in this app is produced by a `page.jsx` (or `page.js`) file inside `src/app/`. The folder path **is** the URL path.

| Route (URL)  | File that produces it        | Type    |
| ------------ | ---------------------------- | ------- |
| `/`          | `src/app/page.js`            | Static  |
| `/Menu`      | `src/app/Menu/page.jsx`      | Static  |
| `/Menu/[id]` | `src/app/Menu/[id]/page.jsx` | Dynamic |
| `/Cart`      | `src/app/Cart/page.jsx`      | Static  |
| `/Checkout`  | `src/app/Checkout/page.jsx`  | Static  |
| `/Home`      | `src/app/Home/page.jsx`      | Static  |

- **Static (`○`)** — prerendered as HTML at build time.
- **Dynamic (`ƒ`)** — server-rendered on demand because the segment reads `params`.

---

## Folder structure

```
Day_36/addis_eats/
├── .next/                             # build output (auto-generated)
├── node_modules/
├── public/
│   └── favicon.ico
├── src/
│   └── app/
│       ├── Menu/
│       │   ├── page.jsx               # /Menu — dish list
│       │   ├── DishList.jsx           # component (not a route)
│       │   ├── CategoryBar.jsx        # component (not a route)
│       │   ├── loading.js             # skeleton shown while /Menu loads
│       │   ├── error.js               # error UI for /Menu segment
│       │   ├── not-found.js           # "Dish not found" UI
│       │   └── [id]/
│       │       └── page.jsx           # /Menu/d1, /Menu/d2, … (one dish)
│       ├── Cart/
│       │   └── page.jsx               # /Cart
│       ├── Checkout/
│       │   └── page.jsx               # /Checkout
│       ├── Home/
│       │   └── page.jsx               # /Home
│       ├── globals.css
│       ├── layout.js                  # root layout (wraps every page)
│       └── page.js                    # / (home)
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── README.md
```

---

## Special files in the App Router

These files have **special meaning** in Next.js and don't create routes:

| File name      | Purpose                                                       |
| -------------- | ------------------------------------------------------------- |
| `layout.js`    | Wraps children in shared layout (persists across navigations) |
| `page.jsx`     | Defines a **route** — the only file that produces a URL       |
| `loading.js`   | Suspense fallback shown while the segment is loading          |
| `error.js`     | Error boundary for the segment (must be a Client Component)   |
| `not-found.js` | UI shown when `notFound()` is called inside the segment       |

**Rule:** a folder only becomes a route if it contains a `page.jsx` (or `page.js`).

---

## What each file does

### `src/app/layout.js`

Root layout. Wraps every page in `<html>` and `<body>`. Loads the global stylesheet and fonts. Persists across client-side navigations — it doesn't re-render when you move between routes.

### `src/app/page.js`

The home page (`/`). Renders a title and links to `/Menu`, `/Cart`, and `/Checkout` using `next/link`.

### `src/app/Menu/page.jsx`

The menu list page (`/Menu`). Renders:

- `<CategoryBar />` — a filter bar of category buttons (Client Component, has `onClick`)
- `<DishList />` — renders each dish as a link to `/Menu/<id>`

### `src/app/Menu/[id]/page.jsx`

The dish detail page (`/Menu/d1`, `/Menu/d2`, …). Reads the dynamic `id` from `params`, and calls `notFound()` if the id isn't in the known list.

```jsx
import Link from "next/link";
import { notFound } from "next/navigation";

const validDishIds = ["d1", "d2", "d3", "d4"];

export default async function DishPage({ params }) {
  const { id } = await params; // Next 15+ requires await

  if (!validDishIds.includes(id)) notFound();

  return (
    <div className="dish-page">
      <h1>Dish: {id}</h1>
      <Link href="/Menu">← Back to Menu</Link>
    </div>
  );
}
```

### `src/app/Menu/DishList.jsx` and `CategoryBar.jsx`

Regular components — **not routes**. They live beside the menu page and are imported by `page.jsx`. Because they aren't named `page.jsx`, Next.js never creates URLs for them.

### `src/app/Menu/loading.js`

Rendered automatically while the `/Menu` segment is loading. To see it, either throttle the network or add a temporary delay inside `Menu/page.jsx`.

### `src/app/Menu/error.js`

Catches any error thrown in the `/Menu` segment. Must start with `"use client"` because it uses the `reset()` function passed to it.

### `src/app/Menu/not-found.js`

Rendered when `notFound()` is called from `Menu/[id]/page.jsx`. Shows a custom "Dish not found" screen with a link back to `/Menu`.

---

## Verifying the route tree

Run the production build and check the route list:

```bash
npm run build
```

Expected output:

```
Route (app)                              Size     First Load JS
┌ ○ /                                    xxx B         xx kB
├ ○ /Cart                                xxx B         xx kB
├ ○ /Checkout                            xxx B         xx kB
├ ○ /Home                                xxx B         xx kB
├ ○ /Menu                                xxx B         xx kB
└ ƒ /Menu/[id]                           xxx B         xx kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

**Every route you expected, and nothing you didn't** — no `/Menu/DishList`, no `/Menu/loading`, no `/Menu/error`. Those files are components and special files; they don't create routes.

---

## Manually verifying each state

| State               | How to test                                                                                                                                                      |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Loading**         | Throttle the network (DevTools → Network → Slow 3G) or add a temporary `await new Promise(r => setTimeout(r, 2000))` inside `Menu/page.jsx`, then visit `/Menu`. |
| **Error**           | Temporarily `throw new Error("test")` inside `Menu/page.jsx`, then visit `/Menu`. Remove the throw after.                                                        |
| **Not found**       | Visit `/Menu/unknown-id` — should render `Menu/not-found.js`.                                                                                                    |
| **Dynamic route**   | Visit `/Menu/d1` directly in the address bar — should render the dish page with `id = "d1"`.                                                                     |
| **Link navigation** | From `/`, click each link — should transition with client-side routing (no full page reload).                                                                    |

---

## Scripts

```bash
npm run dev     # start the dev server on http://localhost:3000
npm run build   # production build — prints the full route table
npm run start   # serve the production build
npm run lint    # run ESLint
```

---

## Notes

- **Folder casing matters.** The URLs in this project use capital letters (`/Menu`, `/Cart`, `/Checkout`) because the folders are capitalized. To use lowercase URLs (`/menu`), rename the folders to lowercase.
- **`params` is async on Next 15+.** In `Menu/[id]/page.jsx`, the `params` object must be awaited before reading `id`.
- **Only `page.jsx` files become routes.** Any other `.jsx` file inside `app/` is a regular component.
