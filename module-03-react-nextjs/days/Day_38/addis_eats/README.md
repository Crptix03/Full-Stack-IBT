# Addis Eats — Day 38: Server & Client Boundaries

A Next.js (App Router) project focused on **sorting components into server and client**, keeping the client bundle as small as possible.

Every component is deliberately placed: data fetching happens in async Server Components, `"use client"` appears only on interactive leaves, and the cart provider is isolated in its own file.

Built with **Next.js 16** and **Tailwind CSS v4**.

---

## What this project demonstrates

- **Async Server Components** for data fetching (`await getDishes()`)
- **Client Components** only where interactivity requires them
- **The `children` pattern** — passing a Server Component into a Client Component without turning it into a client component
- **Providers extracted** into a dedicated `providers.jsx` with `"use client"`
- **4 total client components** across the entire app — the target from the Day 38 exercise

Full analysis in `BOUNDARY.md`.

---

## Route map

| Route          | File                           | Strategy          |
| -------------- | ------------------------------ | ----------------- |
| `/`            | `src/app/page.js`              | Static            |
| `/cart`        | `src/app/cart/page.js`         | Static            |
| `/checkout`    | `src/app/checkout/page.js`     | Dynamic (forced)  |
| `/menu`        | `src/app/menu/page.js`         | Static + ISR (1h) |
| `/menu/[slug]` | `src/app/menu/[slug]/page.jsx` | SSG (4 paths)     |

---

## Project structure

```
Day_38/addis_eats/
├── .next/                              # build output (auto-generated)
├── node_modules/
├── public/
│   └── favicon.ico
├── src/
│   └── app/
│       ├── cart/
│       │   └── page.js                 # /cart
│       ├── checkout/
│       │   └── page.js                 # /checkout (force-dynamic)
│       ├── menu/
│       │   ├── [slug]/
│       │   │   └── page.jsx            # /menu/crispy-sambusa, etc.
│       │   ├── CategoryBar.jsx         # "use client" — onClick
│       │   ├── DishList.jsx            # Server — pure rendering
│       │   ├── FilterShell.jsx         # "use client" — useState + children
│       │   ├── error.js                # "use client" — error boundary
│       │   ├── layout.js               # Nested sidebar layout
│       │   ├── loading.js              # Route loading state
│       │   ├── not-found.js            # Dish-not-found UI
│       │   ├── page.js                 # /menu — async server component
│       │   └── slug.js                 # Pure slug helper
│       ├── favicon.ico
│       ├── globals.css                 # Tailwind import + base
│       ├── layout.js                   # Root layout — header/footer
│       ├── page.js                     # / (home)
│       └── providers.jsx               # "use client" — cart context
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── BOUNDARY.md                         # Client/server component roles
├── README.md
└── STRATEGY.md                         # (optional) rendering strategy
```

---

## Client vs. Server at a glance

**Server Components (default — no `"use client"`):**

| File                                          | Why server                           |
| --------------------------------------------- | ------------------------------------ |
| `layout.js`                                   | Owns `<html>`/`<body>`, static shell |
| `page.js`, `cart/page.js`, `checkout/page.js` | Static pages, no interactivity       |
| `menu/layout.js`                              | Composes sidebar + children          |
| `menu/page.js`                                | Awaits dish data                     |
| `menu/DishList.jsx`                           | Pure rendering                       |
| `menu/[slug]/page.jsx`                        | Awaits params, calls `notFound()`    |
| `menu/loading.js`, `menu/not-found.js`        | Static UI                            |
| `menu/slug.js`                                | Pure function                        |

**Client Components (`"use client"`):**

| File                   | Why client                       |
| ---------------------- | -------------------------------- |
| `providers.jsx`        | Holds cart state with `useState` |
| `menu/CategoryBar.jsx` | Has `onClick`                    |
| `menu/FilterShell.jsx` | Has `useState` for sort          |
| `menu/error.js`        | Uses `reset()`                   |

**Total: 4 client components.**

---

## The key pattern — Server `DishList` inside Client `FilterShell`

`FilterShell` manages sort state, but it receives `<DishList>` as `children` — **not** via import.

```jsx
// FilterShell.jsx — Client Component
"use client";

export default function FilterShell({ children }) {
  const [sort, setSort] = useState("default");
  return (
    <div>
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        ...
      </select>
      {children} {/* Server-rendered, passed through */}
    </div>
  );
}
```

```jsx
// menu/page.js — Server Component
<FilterShell>
  <DishList dishes={dishes} /> {/* Stays on the server */}
</FilterShell>
```

**Why this matters:** if `FilterShell` imported `DishList`, then `DishList` would ship as client JavaScript. By passing it as `children`, `DishList` stays on the server — only its rendered HTML reaches the browser.

Full explanation in `BOUNDARY.md`.

---

## Scripts

```bash
npm run dev     # start the dev server on http://localhost:3000
npm run build   # production build — prints the route table
npm run start   # serve the production build
npm run lint    # run ESLint
```

### Verify the build

```bash
npm run build
```

Expected route table:

```
Route (app)                              Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ○ /cart
├ ƒ /checkout
├ ○ /menu                                    1h        1y
└ ● /menu/[slug]
    ├ /menu/crispy-sambusa
    ├ /menu/steak-and-fries
    ├ /menu/big-smokey-burger
    └ /menu/honey-baklava

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

### If `npm run build` runs out of memory

Next.js 16 + Turbopack can exceed Node's default heap. Fix:

```bash
# Windows PowerShell
$env:NODE_OPTIONS="--max-old-space-size=4096"; npm run build

# macOS / Linux
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

Or limit workers in `next.config.mjs`:

```js
const nextConfig = {
  experimental: {
    workerThreads: false,
    cpus: 2,
  },
};
export default nextConfig;
```

---

## Notes

- **Folder casing matters.** URLs use lowercase because folder names map directly to URLs (`menu` → `/menu`).
- **`params` is async on Next 15+.** In `menu/[slug]/page.jsx`, `params` must be awaited.
- **Only `page.js` files become routes.** Other `.jsx` files are components or special files (`layout`, `loading`, `error`, `not-found`).
- **`loading.js` fires on client-side navigation**, not on hard reload. To see it, navigate to `/menu` from another page.
- **`error.js` must be a Client Component.** Requires `"use client";`.
- **`FilterShell` and `CategoryBar` are demos of the boundary pattern**, not fully functional filters. Making them work would either force `DishList` to be a client component or force `/menu` to be dynamic — both defeat the exercise.

---

## Related documentation

- **`BOUNDARY.md`** — every component's server/client role, with the reasoning
- **`STRATEGY.md`** — the rendering strategy per route (static, ISR, SSG, dynamic)

---

## Summary

This project demonstrates:

- Async Server Components fetching data with `await`
- Client Components only at interactive leaves
- The `children` pattern for wrapping server components in client wrappers
- `providers.jsx` isolating the cart context behind one `"use client"` boundary
- A total of **4 client components** — right at the Day 38 target
- Clean separation between routing (server) and interactivity (client)
