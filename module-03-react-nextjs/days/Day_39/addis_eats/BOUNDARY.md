# Client / Server Boundaries

Every component in the app, which side it runs on, and why.

## The rule

- **Server Component** (default) — runs only on the server. Can `await`, has no hooks, no `onClick`. Ships **zero JavaScript** to the browser.
- **Client Component** (`"use client"` at the top) — runs on both server and browser. Can use hooks, event handlers, and browser APIs. Ships JavaScript to the browser.

**Goal:** push `"use client"` as far down the tree as possible so most of the app stays server-rendered and the client bundle stays small.

## Server Components (no `"use client"`)

| File                           | Why server                                                                                                                                                  |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/layout.js`            | Owns `<html>`, `<body>`, header, footer. Renders static shell. Wraps children in `<Providers>` — that's fine, the boundary is at `providers.jsx`, not here. |
| `src/app/page.js`              | Home page — pure static content, no hooks, no interaction.                                                                                                  |
| `src/app/cart/page.js`         | Static placeholder — no interactivity yet.                                                                                                                  |
| `src/app/checkout/page.js`     | Static placeholder — forced dynamic with `export const dynamic = "force-dynamic"` for future session reads.                                                 |
| `src/app/menu/layout.js`       | Composes `<CategoryBar>` (client) and `{children}` (server). The composition itself is server.                                                              |
| `src/app/menu/page.js`         | **Async server component** — `await getDishes()` fetches data on the server. This is the reason it can't be a client component.                             |
| `src/app/menu/DishList.jsx`    | Pure rendering — maps over dishes and links to detail pages. No hooks, no event handlers.                                                                   |
| `src/app/menu/loading.js`      | Static loading fallback UI.                                                                                                                                 |
| `src/app/menu/not-found.js`    | Static 404 UI with a link back to menu.                                                                                                                     |
| `src/app/menu/[slug]/page.jsx` | Async server component — awaits `params`, looks up the dish, and calls `notFound()`. Uses `generateStaticParams` to prerender.                              |
| `src/app/menu/slug.js`         | Pure function — no JSX, no hooks. Used on both server and client.                                                                                           |

## Client Components (`"use client"`)

| File                           | Why client                                                                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/providers.jsx`        | Wraps the app in a React Context that holds cart state with `useState`. Any component that consumes the cart needs this to be a client component. |
| `src/app/menu/CategoryBar.jsx` | Has `onClick` handlers on the category buttons. Must run in the browser.                                                                          |
| `src/app/menu/FilterShell.jsx` | Manages the `sort` state with `useState` and reads user input from a `<select>`.                                                                  |
| `src/app/menu/error.js`        | Uses the `reset()` function Next.js passes to error boundaries. Must be a client component — this is a Next.js requirement for `error.js` files.  |

**Total: 4 client components.**

The Day 38 exercise says: _"On a well-sorted application of this size you should find three or four — if you find ten, the boundary is sitting too high."_ We're at 4. ✅

## The key boundary: FilterShell + DishList

This is the pattern Day 38 is really about — wrapping a **server** component (DishList) in a **client** component (FilterShell) **without** turning DishList into a client component.

### ❌ Wrong — DishList gets bundled as client

```jsx
"use client";
import DishList from "./DishList";

export default function FilterShell() {
  return (
    <div>
      <select>{/* sort options */}</select>
      <DishList /> {/* DishList is now part of the client bundle */}
    </div>
  );
}
```

If FilterShell **imports** DishList, then DishList gets included in the client JavaScript bundle — even though it has no interactivity.

### ✅ Right — DishList stays on the server

```jsx
"use client";

export default function FilterShell({ children }) {
  return (
    <div>
      <select>{/* sort options */}</select>
      {children} {/* Server-rendered, passed through as a prop */}
    </div>
  );
}
```

In `menu/page.js` (a server component):

```jsx
<FilterShell>
  <DishList dishes={dishes} />{" "}
  {/* Rendered on the server, passed as children */}
</FilterShell>
```

The `<DishList>` JSX is rendered **on the server**, serialized as HTML + a small amount of metadata, and streamed to the browser. It never becomes part of the client bundle.

**React treats `children` as already-rendered** — the client component just receives it and renders it, without needing to know what's inside.

## Why this matters

For a demo app, the difference is small — DishList is a tiny component. But scale this up:

- A **200 kB markdown renderer** — server-only if passed as children
- A **500 kB chart library** — server-only if passed as children
- A **full data table with sorting** — client-rendered if imported, server-rendered if children

The pattern is what matters: **pass server components as `children` to client components when you need interactivity around them.**

## Recording First Load JS

Run `npm run build` and look at the route table:

```
Route (app)                              Size     First Load JS
┌ ○ /                                    xxx B         xx kB
├ ○ /cart                                xxx B         xx kB
├ ƒ /checkout                            xxx B         xx kB
├ ○ /menu                                xxx B         xx kB
└ ● /menu/[slug]                         xxx B         xx kB
    ├ /menu/crispy-sambusa
    ├ /menu/steak-and-fries
    ├ /menu/big-smokey-burger
    └ /menu/honey-baklava
```

**Compare First Load JS for `/menu`:**

| Version                                     | First Load JS              | Notes                                  |
| ------------------------------------------- | -------------------------- | -------------------------------------- |
| Before (DishList imported into FilterShell) | _(hypothetical)_           | DishList would be in the client bundle |
| After (DishList passed as children)         | _(record from real build)_ | DishList stays on the server           |

In our project, the numbers are close because DishList is small. The pattern is what matters — in a real app with heavy components, passing them as children can cut hundreds of kB from the client bundle.

## Rules of thumb

1. **Start every component as a Server Component.** Only add `"use client"` when you actually need it.
2. **Fetch data in Server Components.** Use `async` + `await` — no `useEffect` for initial data.
3. **Keep Client Components small and at the leaves.** Just the interactive bits.
4. **Never import a Server Component into a Client Component.** Pass it as `children` instead.
5. **Push `"use client"` down the tree.** A wrapper with `"use client"` makes every import inside it a client component too.
6. **Providers get their own file.** `providers.jsx` holds the `"use client"` boundary so `layout.js` stays server.

## What runs where in this app

```
Browser
  └── RootLayout (server)
        └── Providers (client — cart context)
              └── Header (server markup)
              └── Main
                    └── MenuLayout (server)
                          ├── CategoryBar (client — onClick)
                          └── MenuPage (server — awaits dishes)
                                └── FilterShell (client — useState)
                                      └── children:
                                            └── DishList (server — passed as children)
              └── Footer (server)
```

**Only 3 small components run on the client** inside the page tree: `Providers`, `CategoryBar`, `FilterShell`. Everything else is server-rendered.
