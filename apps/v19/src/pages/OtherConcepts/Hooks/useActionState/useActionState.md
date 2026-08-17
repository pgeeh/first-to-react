# useActionState

`useActionState` is new in React 19. It updates _state_ based on the result of a form _Action_ - a function passed to a `<form>`'s `action` prop (or a `<button>`'s `formAction` prop) that React calls automatically on submission, including a pending status while it runs.

`useActionState` takes two (optionally three) arguments:
* Action function - called with the current _state_ and the submitted `FormData`, and returns the new _state_. It can be `async`.
* Initial state - the _state_ value before the first submission.
* (Optional) Permalink - a URL used for progressive enhancement before JavaScript has loaded.

It returns an array of three items:
* Current _state_ - starts as the initial state, then becomes whatever the action function last returned.
* Action - pass this to the `<form>`'s `action` prop (or a `<button>`'s `formAction` prop) instead of the original function.
* `isPending` - `true` while the action is running, useful for disabling the submit button or showing a spinner.

Because the action receives `FormData` rather than individual controlled _state_ values, form fields inside can stay _uncontrolled_ (just `name` attributes, no `value`/`onChange`) - React reads their values from the form on submission.

The __Update Name__ example shows a form using an `async` action to simulate a server request, returning either the updated _state_ or an error message that's rendered back into the form.
