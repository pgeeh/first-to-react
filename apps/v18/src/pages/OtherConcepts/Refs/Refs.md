# Refs

A _ref_ is an escape hatch for accessing a DOM node or component instance directly, outside of the normal _props_/_state_ render flow. Refs are useful for things React doesn't have a declarative way to express, like focusing an input, measuring an element, or triggering an imperative animation.

`useRef` creates a mutable object with a single `current` property, which starts as whatever initial value is passed in. Unlike `useState`, changing `ref.current` does not cause a re-render - it's meant for values that need to persist across renders without being part of the rendered output.

Attaching a `ref` to a built-in element (like `<input ref={myRef} />`) sets `myRef.current` to the actual DOM node once it's mounted.

Function components do not accept a `ref` _prop_ by default - passing one is silently dropped. To let a parent attach a ref to a DOM node inside your own function component, wrap it in `React.forwardRef`, which receives `props` and `ref` as two separate arguments instead of `ref` being bundled into `props`.

The __Focus Input__ example shows a basic `useRef` attached directly to an `<input>`, used to call `.focus()` on it.

The __Forwarded Ref__ example shows a custom `FancyInput` component using `forwardRef` so a parent can focus the `<input>` nested inside it, the same way it could focus a plain `<input>` directly.
