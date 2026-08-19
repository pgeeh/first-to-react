# Hooks

React Hooks provide the ability for a functional component to slowly add lifecycle capabilities. Available Hooks include:

* __useState__ - Provides _state_ management for a functional component.

* __useMemo__ - Provides [memoization](https://en.wikipedia.org/wiki/Memoization) to reduce unnecessary or expensive recalculation of values.

* __useEffect__ - Allows creation of functions that execute either during each render or after a certain subset of _props_ or _state_ changes and performs side effects.

* __useCallback__ - Creates a scoped callback and only re-creates it if a subset of _props_ or _state_ changes.

* __useReducer__ - Provides more advanced _state_ management using actions and a dispatcher. A lightweight [redux](https://redux.js.org/) or [flux](https://facebook.github.io/flux/) substitute.

* __useContext__ - Provides the ability to set values that can be used by child components without the need to pass all of the information down through _props_.

* __useTransition__ _(introduced in React 18)_ - Marks a _state_ update as a low-priority _transition_ so React can keep the UI responsive while it renders.

* __useId__ _(introduced in React 18)_ - Generates a unique, stable ID string for accessibility attributes, consistent between server and client renders.

* __useDeferredValue__ _(introduced in React 18)_ - Returns a lagging copy of a value so an expensive render using it doesn't block a more urgent update.

* __useSyncExternalStore__ _(introduced in React 18)_ - Safely subscribes a component to a value that lives outside React, such as a browser API or a third-party store.

* __use__ _(new in React 19)_ - Reads a Promise or Context value. Unlike other Hooks, it can be called conditionally or in loops.

* __useActionState__ _(new in React 19)_ - Tracks _state_ produced by a form Action, including a pending status while the action runs.

* __useOptimistic__ _(new in React 19)_ - Shows an optimistic value while a form Action is still in flight, then reconciles back to the real _state_.

* __useFormStatus__ _(new in React 19, from `react-dom`)_ - Reads the pending status of the nearest parent `<form>` from a component nested inside it.

React 18 also introduced __automatic batching__, still in effect in React 19: _state_ updates inside promises, `setTimeout`, and native event handlers are grouped into a single re-render, the same way updates inside React event handlers always were.

Some rules to remember when using Hooks:

* Hooks should only be used prior to the start of the `return` statement. Hooks need to be run in the same order during each render iteration so that the internal tracking of React can function.

* Hooks should not be called in any loop or conditional. Similar to above, Hooks need to be executed in a static order, with `use` as the one exception - see its own page for details.

Additional Hook reference can be found on [React's Doc Website - Hooks](https://reactjs.org/docs/hooks-intro.html).
