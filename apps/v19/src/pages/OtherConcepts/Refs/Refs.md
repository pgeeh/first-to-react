# Refs

A _ref_ is an escape hatch for accessing a DOM node or component instance directly, outside of the normal _props_/_state_ render flow. Refs are useful for things React doesn't have a declarative way to express, like focusing an input, measuring an element, or triggering an imperative animation.

`useRef` creates a mutable object with a single `current` property, which starts as whatever initial value is passed in. Unlike `useState`, changing `ref.current` does not cause a re-render - it's meant for values that need to persist across renders without being part of the rendered output.

Attaching a `ref` to a built-in element (like `<input ref={myRef} />`) sets `myRef.current` to the actual DOM node once it's mounted.

__React 19 change:__ function components can now receive `ref` directly as a normal prop, and can pass it along to a DOM node just like any other prop. Earlier versions dropped a `ref` passed to a function component silently, requiring `React.forwardRef` to receive it as a second argument alongside `props`. `forwardRef` still works in React 19 for existing code, but it's no longer necessary for new components, and a future major version is expected to remove it in favor of the plain-prop approach.

The __Focus Input__ example shows a basic `useRef` attached directly to an `<input>`, used to call `.focus()` on it - unchanged from earlier React versions.

The __Ref as Prop__ example shows a custom `FancyInput` component reading `ref` straight out of `props`, letting a parent focus the `<input>` nested inside it without needing `forwardRef` at all.
