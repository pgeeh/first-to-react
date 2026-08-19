# useOptimistic

`useOptimistic` is new in React 19. It shows an _optimistic_ version of some _state_ while an async action (like a form submission) is still in flight, then reconciles back to the real value once the action finishes.

`useOptimistic` takes two arguments:
* Current _state_ - the real, confirmed value (for example, from `useState`).
* Update function - takes the current state and an "optimistic" payload, and returns the value to show immediately.

It returns an array of two items:
* Optimistic _state_ - the current state, or the optimistic value while an update is pending.
* `addOptimistic` - a function to trigger an optimistic update; call it (typically inside a form Action) with the payload to pass to the update function.

The optimistic value is automatically discarded once the surrounding action finishes and the underlying state has actually changed - React re-renders with the real state as soon as it's set, whether or not the optimistic guess matched it. This makes `useOptimistic` a natural pairing with `useActionState`: the action does the real (possibly slow) work, while `useOptimistic` gives the user instant feedback that something happened.

The __Message List__ example shows a chat-style list where a new message appears immediately (marked _Sending..._) when the form is submitted, before the simulated network request actually finishes.
