# use

`use` is new in React 19. It reads the value of a resource - either a Promise or a Context - and, unlike other Hooks, it is allowed to be called conditionally or inside loops, since it isn't tied to a fixed per-render Hook order the way `useState`/`useEffect`/etc. are.

`use` takes a single argument:
* A Promise - the component _suspends_ (pauses rendering) until the Promise resolves, then `use` returns the resolved value. The nearest `<Suspense>` boundary shows its `fallback` while waiting. If the Promise rejects, the nearest error boundary catches it.
* A Context - equivalent to calling `useContext` with that context.

Because `use` re-suspends whenever it's given a *new* Promise instance, the Promise passed in should be cached (e.g. in a `Map`, or from a data-fetching library) rather than created fresh inline during render - creating a new, never-resolving-relative-to-cache Promise on every render is a common mistake that causes the component to suspend forever.

The __Promise__ example shows `use` reading a cached `fetch` Promise, suspending the component until the response arrives. Changing the `userId` in the Prop Override triggers a new fetch and a new suspended fallback. Rather than setting up an error boundary, this example catches a failed request itself and resolves to an error marker instead, so a failed fetch just renders a message.

The __Conditional Context__ example shows `use` reading a Context value inside a conditional branch - something `useContext` cannot do, since regular Hooks must run unconditionally on every render.
