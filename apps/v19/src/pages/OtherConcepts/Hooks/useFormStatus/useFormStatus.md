# useFormStatus

`useFormStatus` is new in React 19, exported from `react-dom` rather than `react`. It reads the pending status of the nearest parent `<form>`, without that status needing to be passed down as _props_.

`useFormStatus` takes no arguments and returns an object with:
* `pending` - `true` while the parent form's Action is running.
* `data` - the `FormData` being submitted, or `null` when nothing is pending.
* `method` - the HTTP method of the submission (`get` or `post`).
* `action` - a reference to the action function passed to the form.

It only works when called from a component *rendered inside* a `<form>` - not the component that renders the `<form>` itself. This makes it useful for building a reusable submit button that shows a pending state without the parent needing to pass a `pending` prop down manually.

The __Submit Button__ example shows a `SubmitButton` component that disables itself and shows "Saving..." purely by reading `useFormStatus`, reused inside a form driven by `useActionState`.
