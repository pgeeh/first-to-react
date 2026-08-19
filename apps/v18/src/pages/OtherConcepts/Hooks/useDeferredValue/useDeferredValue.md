# useDeferredValue

`useDeferredValue` is new in React 18. It returns a _deferred_ copy of a value that can lag behind the real value during an expensive re-render, letting React keep the UI responsive without needing to wrap the update in `startTransition` at the call site that changes it.

`useDeferredValue` takes one argument - the value to defer - and returns the deferred value. On the first render, the deferred value is the same as the real one; when the real value changes, React first tries to re-render with the *old* deferred value, then re-renders again in the background with the new one once it's ready.

Comparing the deferred value to the real value (`value !== deferredValue`) tells you whether the render is stale, which is commonly used to dim or otherwise mark content that hasn't caught up yet.

`useDeferredValue` and `useTransition` solve a similar problem from different sides: `useTransition` wraps the *update* that triggers the slow render (useful when you own the code that changes the state), while `useDeferredValue` wraps the *value* used by the slow render (useful when the slow render is a child component you don't control, or the value arrives via _props_ rather than local _state_).

The __Deferred Filter__ example shows a large list filtered by a deferred query - the input stays responsive while the list dims and catches up shortly after typing stops.
