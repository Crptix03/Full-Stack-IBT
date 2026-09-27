# Client / Server Boundaries

Every component, which side it runs on, and why.

## The rule

- **Server Component** (default) — runs only on the server. Can `await`, has no hooks, no `onClick`. Ships **zero JavaScript** to the browser.
- **Client Component** (`"use client"` at the top) — has hooks, event handlers, or browser APIs. Ships JavaScript.

**Goal:** push `"use client"` to the leaves so most of the app stays server-rendered.

## Client Components (`"use client"`)

| File                                        | Why client                                                                                                                                                 |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/providers.jsx`                         | Holds cart state via `useState`. Any consumer needs this to be a client boundary. Lives in `lib/` per the PDF's rule that shared code sits outside `app/`. |
| `app/cart/page.js`                          | Reads `useCart()` and renders Remove buttons — has both context reads and interactivity.                                                                   |
| `app/checkout/CheckoutForm.jsx`             | Has `useActionState` for the server action + `useCart()` for the items.                                                                                    |
| `app/checkout/success/ClearCartOnMount.jsx` | Has `useEffect` to clear the cart when the success page mounts.                                                                                            |
| `app/menu/CategoryBar.jsx`                  | Has `onClick` for category selection.                                                                                                                      |
| `app/menu/FilterShell.jsx`                  | Has `useState` for the sort dropdown.                                                                                                                      |
| `app/menu/AddToCartButton.jsx`              | Has `onClick` that writes to the cart store.                                                                                                               |
| `app/error.js`                              | Next.js requirement — uses the `reset()` function.                                                                                                         |
| `app/menu/error.js`                         | Same — segment-level error boundary.                                                                                                                       |

**Total: 9 client components.**

## Server Components (no `"use client"`)

| File                                              | Why server                                   |
| ------------------------------------------------- | -------------------------------------------- |
| `app/layout.js`                                   | Owns `<html>` and `<body>` — must be server. |
| `app/page.js`                                     | Static landing page.                         |
| `app/menu/layout.js`                              | Composes the sidebar and children.           |
| `app/menu/page.js`                                | Awaits `getDishes()` — data fetch.           |
| `app/menu/[slug]/page.jsx`                        | Awaits params + dishes, calls `notFound()`.  |
| `app/menu/DishList.jsx`                           | Pure rendering, no hooks.                    |
| `app/menu/slug.js`                                | Pure function.                               |
| `app/checkout/page.js`                            | Server shell that declares `force-dynamic`.  |
| `app/checkout/success/page.js`                    | Awaits `searchParams`.                       |
| `app/actions.js`                                  | Server Actions — `"use server"` directive.   |
| `app/api/**/route.js`                             | Route handlers.                              |
| `lib/dishes.js`, `lib/orders.js`, `lib/schema.js` | Shared code — data + validation.             |

## The three unavoidable client components

If I had to defend the absolute minimum:

1. **`lib/providers.jsx`** — cart context. Must be client.
2. **`app/menu/CategoryBar.jsx`** (or `FilterShell`) — selection state. Must be client.
3. **`app/menu/AddToCartButton.jsx`** — mutation. Must be client.

Everything else is either:

- A **Next.js requirement** — `error.js` files must be client components.
- A **mechanical split** — a server page wrapping a client form (`checkout/page.js` + `CheckoutForm.jsx`).

## Composition patterns

### Server page wrapping client leaves

```jsx
// app/menu/[slug]/page.jsx — Server Component
<AddToCartButton dish={dish} />
```

The page is server; it renders a client button. The button ships JS; the rest of the page doesn't.

### Client wrapper receiving server content as children

```jsx
// app/menu/FilterShell.jsx — Client Component
"use client";

export default function FilterShell({ children }) {
  const [sort, setSort] = useState("default");
  return (
    <div>
      <select ... />
      {children}
    </div>
  );
}
```

```jsx
// app/menu/page.js — Server Component
<FilterShell>
  <DishList dishes={dishes} />
</FilterShell>
```

`DishList` renders on the server and passes through the client wrapper. **It never becomes part of the client bundle.**

## Where `providers.jsx` lives — and why

`providers.jsx` is at **`lib/providers.jsx`**, not `app/providers.jsx`.

**Why:**

- The PDF says: _"Shared code sits outside `lib/` and `components/` at the project root for anything used by more than one route."_
- `providers.jsx` is used by every consumer of `useCart` — the cart page, the checkout form, the add-to-cart button, and the success page. It's shared across routes.
- Placing it in `lib/` keeps `app/` limited to routes and route-specific components.

**Contrast:** `actions.js` lives at `app/actions.js` because the PDF's own tree puts it there — it's a set of Server Actions used by routes, not a reusable component. `providers.jsx` is a component, which is why it belongs in `lib/`.

## Why 9 instead of the PDF's 3–4

The PDF says: _"If your list has more than four or five client components, look again at what actually needs interactivity."_

Each one is justified:

- **`lib/providers.jsx`** — the app needs a cart somewhere. This is the boundary.
- **`app/cart/page.js`** — the cart page must read the store and offer Remove.
- **`app/checkout/CheckoutForm.jsx`** — the form has state + a server action.
- **`app/checkout/success/ClearCartOnMount.jsx`** — clears cart on mount. No other way to run code on the redirect target.
- **`app/menu/CategoryBar.jsx`** + **`app/menu/FilterShell.jsx`** — two interactive selection UIs (category filter and sort dropdown).
- **`app/menu/AddToCartButton.jsx`** — the only mutation entry point.
- **`app/error.js`** + **`app/menu/error.js`** — **Next.js requires these to be client components.**

**If I wanted to shrink further:**

- Merge `CategoryBar` into `FilterShell` → 1 fewer file, but less separation of concerns.
- Collapse both `error.js` files into one at root → loses per-segment isolation.
- Move `ClearCartOnMount` into `CheckoutForm` → doesn't work because the redirect unmounts the form before it can react.

**None of these improve the app.** The boundary is where it needs to be.

## Rules of thumb applied

1. **Start every component as a Server Component.** Only add `"use client"` when something forces it. ✅
2. **Fetch data in Server Components.** `menu/page.js` awaits `getDishes()`. ✅
3. **Keep Client Components small and at the leaves.** `AddToCartButton` is 20 lines; `CategoryBar` is 25. ✅
4. **Never import a Server Component into a Client Component.** `DishList` is passed as `children`, not imported. ✅
5. **Push `"use client"` down the tree.** No `page.js` file has `"use client"` except `cart/page.js` (which is genuinely all-interactive). ✅
6. **Providers get their own file.** `lib/providers.jsx` holds the boundary. ✅

## Bundle size

The First Load JS for `/menu` reflects the menu's client components (`CategoryBar`, `FilterShell`, `AddToCartButton`). The dish pages are lightweight because `AddToCartButton` is the only client code there.

Precise numbers captured by inspecting `npm run build` output.
