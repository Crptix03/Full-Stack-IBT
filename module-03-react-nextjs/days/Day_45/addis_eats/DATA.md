# DATA.md — Where every query runs, and why

The rule is: server unless the person triggers it.
Anything that isn't a direct user action belongs on the server.
Anything a person types or that must keep refreshing on its own runs on the client — and even then it is seeded from the server.

---

## 1. Query Table

| Data                        | Where                                 | Key                   | Refresh Rule                            | Reasoning                                                                             |
| :-------------------------- | :------------------------------------ | :-------------------- | :-------------------------------------- | :------------------------------------------------------------------------------------ |
| Menu and dishes             | Server (src/lib/dishes.js)            | None                  | revalidate = 3600 (1 hour)              | Public, indexable, cacheable. No session required.                                    |
| Single dish                 | Server (getDishes() + filter)         | slug from URL         | Static per build (generateStaticParams) | Same data as the menu, addressed by slug.                                             |
| Order history (/orders)     | Server (getOrdersFor(session.userId)) | Session id            | Per request (dynamic)                   | Private. Scoped to the session. Never to a sent id.                                   |
| Single order (/orders/[id]) | Server first, then polled             | Session id + order id | SWR refreshInterval: 5000 (5 s)         | Live status. Server renders the first result so nobody sees a spinner.                |
| Order status (poll)         | Client SWR (/api/orders/[id])         | Order id              | Every 5 s while page is open            | The one query that must refresh on its own. Seeded from the server.                   |
| Menu search                 | Client (SearchBox)                    | Search term           | Debounced 300 ms                        | Triggered by typing. Cannot run on the server because the input lives in the browser. |
| Category filter             | Client (URL param + server filter)    | category from URL     | Per navigation                          | Server filters using the URL param — no client-side query needed.                     |
| Cart                        | Client (CartContext)                  | In-memory state       | Immediate (React)                       | Never leaves the browser. No persistence.                                             |
| Current user (session)      | Server (getSession())                 | Session cookie        | Per request                             | Read from httpOnly cookie. Never exposed to the client.                               |

---

## 2. The Reasoning Behind Each Decision

### Menu and dishes — server

The menu is the same for every visitor. It should be cached at the edge, indexed by Google, and rendered without JavaScript. revalidate = 3600 means Next.js regenerates the HTML once an hour at most.

### Single dish — server

Same reasoning as the menu. generateStaticParams pre-renders every dish at build time.

### Order history — server, scoped to session

This is the highest-risk query. The URL never carries a user id — the session cookie does. The query is getOrdersFor(session.userId), so a user cannot fetch another user's orders even if they craft a URL.

### Single order — server seed + client poll

- The server calls getOrderById(id) and checks ownership before rendering the page.
- The result is passed to the client as fallbackData for SWR.
- SWR then polls /api/orders/[id] every 5 seconds.
- The API route re-checks the session and ownership.
- Result: the page arrives fully rendered (no spinner), and the status stays live.

This is the pattern the PDF calls "seed the exception" — a client query is unavoidable for live updates, so we render the first result on the server and pass it in.

### Menu search — client, debounced

The input exists only in the browser. It cannot run on the server. The search value is written to the URL after a 300 ms debounce, then the server re-renders the page with the new q param. One request per pause, not per keystroke.

### Cart — client

Never leaves the browser. It's the user's in-progress selection, not committed data. It becomes a server query only when the user submits the checkout form (the placeOrder server action).

---

## 3. What Seeded Fallback Data Buys Us

Without seeding:

    /orders/order-123
      server renders "Loading..."
         client mounts
            SWR fetches /api/orders/order-123
               data arrives ~500 ms later

With seeding:

    /orders/order-123
      server renders the actual order
         client mounts with the same data already present
            SWR polls in the background for changes

No spinner. No flash. No layout shift. If the network is slow, the user still sees the correct order immediately.

---

## 4. Verification

### Live data — Network tab while typing

Open DevTools, go to Network, filter by Fetch/XHR. Type into the menu search box.
Expected: one request after each pause. Verified.

### Seeding — Network tab on /orders/[id]

Hard-refresh the page.
Expected: the order is on screen before the first API call appears in the Network tab.
Verified.

### Polling — Network tab, wait 10 seconds

Expected: one request every 5 seconds to /api/orders/[id]. Verified.

### Scoping — Visit another account's order id

Sign in as alex, visit a URL that belongs to customer.
Expected: 404 page, not the order. Verified.
