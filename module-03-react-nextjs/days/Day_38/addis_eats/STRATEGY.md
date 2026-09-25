# Rendering Strategy

Every route in the Addis Eats app, its rendering strategy, and why.

## Recorded build output

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

**10 static pages generated at build time** (`10/10` in the build log).

## Strategy per route

| Route        | Strategy           | Why                                                                                                                                                                           |
| ------------ | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`          | Static (`○`)       | Same for every visitor — home page content never changes based on who is asking.                                                                                              |
| `/cart`      | Static (`○`)       | Cart lives in client state (Zustand + localStorage). The page shell is identical for everyone.                                                                                |
| `/checkout`  | Dynamic (`ƒ`)      | Forced with `export const dynamic = "force-dynamic"` — checkout reads the signed-in session, which only exists per-request. Prerendering this would produce the wrong output. |
| `/menu`      | Static + ISR (`○`) | `export const revalidate = 3600` — dishes change rarely. Static speed with hourly background refresh.                                                                         |
| `/menu/[id]` | SSG (`●`)          | `generateStaticParams` returns all 4 dish IDs. Next.js prerenders 4 static pages at build time.                                                                               |

## Streaming

`/menu` wraps its dish list in a `<Suspense>` boundary with a
`"Loading dishes…"` fallback. The sidebar (from `menu/layout.js`) and the page
shell render immediately; the dish list streams in when its data resolves.

**Why it matters:** a slow dish fetch never blocks the header, footer, or
category sidebar from appearing. The user sees page structure right away
instead of a blank screen.

## Persistent layout

`menu/layout.js` wraps both `/menu` and `/menu/[id]` in the same sidebar
layout. Next.js preserves nested layouts across client-side navigation, so
the sidebar does **not** re-render when clicking from the dish list into a dish
detail page — it stays mounted, only the main content area swaps.

## Route segments

- **Static (`○`)** — prerendered to HTML at build time and served from cache.
- **Static + ISR (`○`)** — prerendered at build time, then revalidated in the
  background at the interval specified by `revalidate`.
- **SSG with `generateStaticParams` (`●`)** — a dynamic route with a fixed set
  of known params. Next.js generates one static page per param at build time.
- **Dynamic (`ƒ`)** — server-rendered on every request, because the page reads
  request-time data like `cookies()` or `headers()`.

## When would this strategy change?

- **`/menu`** would become dynamic if dish data became personalised (e.g.
  "dishes recommended for you"), because the output would depend on the user.
- **`/menu/[id]`** would stay SSG but gain a `revalidate` if dish details
  changed without a full rebuild.
- **`/checkout`** would stay dynamic but likely add a `loading.js` for a
  smoother transition, since checkout forms often need a moment to hydrate.
