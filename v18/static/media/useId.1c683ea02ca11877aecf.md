# useId

`useId` is new in React 18. It generates a unique, stable ID string that stays the same across every render of a given component instance.

`useId` takes no arguments and returns a single ID string. It should be used for generating IDs to associate with accessibility attributes, such as linking a `<label>` to an `<input>` with `htmlFor`/`id`, not as a general-purpose "unique key" generator (list items should still use `key`s derived from their own data, not `useId`).

The ID is unique across the whole page, so the same component can be rendered multiple times without its internal IDs colliding with each other - useful for a reusable form field component. `useId` should not be used to generate keys in a list, since a list can render a variable number of items across renders; `useId` values are stable per component instance, not per array index.

Unlike `Math.random()` or an incrementing counter, `useId` also produces the same value on the server and the client during server-side rendering, so hydration doesn't mismatch.

The __Labeled Fields__ example shows a reusable `LabeledInput` component rendered multiple times, each generating its own `useId` value so every field's `<label>` correctly points at its own `<input>`.
