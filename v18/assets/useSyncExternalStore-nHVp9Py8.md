# useSyncExternalStore

`useSyncExternalStore` is new in React 18. It subscribes a component to a value that lives *outside* React (a "store"), such as a browser API or a third-party state library, in a way that stays correctly synchronized under React 18's concurrent rendering - reading the store directly in the render body (e.g. `window.innerWidth`) can otherwise tear, showing inconsistent values across a single render pass.

`useSyncExternalStore` takes two (optionally three) arguments:
* `subscribe` - a function that takes a callback, registers it with the store (e.g. `addEventListener`), and returns an unsubscribe function.
* `getSnapshot` - a function that returns the store's current value. React calls this on every render, and re-renders whenever the returned value changes (compared with `Object.is`).
* (Optional) `getServerSnapshot` - a function that returns the value to use during server-side rendering.

Most application code doesn't call `useSyncExternalStore` directly - it's primarily meant for library authors to build hooks like a router's `useLocation` or a state library's `useSelector` on top of. Reaching for `useState`/`useEffect` is usually simpler for application code, but `useSyncExternalStore` is the one guaranteed-safe way to read a truly external, mutable value.

The __Window Width__ example shows a small hook built on `useSyncExternalStore` that tracks `window.innerWidth`, subscribing to the `resize` event and re-rendering only when the width actually changes.
