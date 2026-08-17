# useTransition

`useTransition` is new in React 18. It marks a _state_ update as a low-priority _transition_, letting React keep the screen responsive to more urgent updates (like typing in an input) while the transition's update renders in the background.

`useTransition` takes no arguments and returns an array of two items:
* `isPending` - a boolean that is `true` while the transition is still rendering
* `startTransition` - a function that takes a callback; any _state_ updates made inside that callback are treated as the transition

Only _state_ updates wrapped in `startTransition` are deprioritized - anything updated outside of it (like the input's own value below) still renders immediately, so the UI never feels like it's lagging behind what was typed.

This pairs with React 18's automatic batching: multiple _state_ updates inside the same event handler (or the same `startTransition` callback) are grouped into a single re-render instead of one render per update, which is part of what makes transitions cheap to use liberally.

The __Filtered List__ example shows a text input filtering a large list. The list update is wrapped in `startTransition`, so the input stays responsive even while the (much larger) filtered list is still rendering, and `isPending` is used to show a subtle loading indicator.
