# Performance Profile — Addis Eats

## Session info

Recorded with React DevTools Profiler. The recorded session captured **78 commits** in total.

## Commit 1 of 78 — caused by `BrowserRouter`

This commit was triggered by `BrowserRouter` (a route/navigation change), not by an "Add" click — included here as the first data point captured in the session.

- **Total render duration:** 5.7ms
- **Layout effects:** 0.1ms
- **Passive effects:** 0.1ms
- **Committed at:** 5.3s into the profiling session

**Render breakdown (flamegraph, this commit):**

| Component                           | Self time | Time incl. children |
| ----------------------------------- | --------- | ------------------- |
| `Routes`                            | 0.7ms     | 5.2ms               |
| `ErrorBoundary` (around `CartPage`) | 0.9ms     | 3.1ms               |
| `CartPage`                          | 0.5ms     | 2.2ms               |
| `Link` (inside `CartPage`)          | 1.1ms     | 1.4ms               |

**Observation:** `ErrorBoundary` and `Link` stand out with the highest self-time in this commit (flagged orange/yellow in the flamegraph), meaning they account for the most render work relative to their size — `Link`'s 1.1ms self-time on a 1.4ms subtree is disproportionately expensive for what should be a lightweight anchor-rendering component.

## Add-three-dishes session — before

<!-- Record a fresh Profiler session: click record, add three different dishes via
their "Add" buttons, stop recording, then fill in the slowest commit's data here.
Look specifically at whether Layout, CategoryBar, or unrelated Dish cards
re-render on each Add click — none of them should, since cart state now lives
in the Zustand store and only components with a matching selector (CartBadge,
the Dish card actually clicked) should re-render. -->

- **Slowest component:**
- **Unnecessary re-renders observed:**

## Change made

<!-- Describe the one fix — e.g. "Wrapped CategoryBar in React.memo since it only
depends on `categories`, `selected`, and `onSelect`, none of which change when
a dish is added to the cart." -->

## Add-three-dishes session — after

<!-- Record the same three-dish-add sequence again post-fix. -->

- **Component render count before:**
- **Component render count after:**
- **Notes:**
