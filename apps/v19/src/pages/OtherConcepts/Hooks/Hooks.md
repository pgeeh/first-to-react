# Hooks

React Hooks provide the ability for a functional component to slowly add lifecycle capabilities. Available Hooks include:

* __useState__ - Provides _state_ management for a functional component.

* __useMemo__ - Provides [memoization](https://en.wikipedia.org/wiki/Memoization) to reduce unnecessary or expensive recalculation of values.

* __useEffect__ - Allows creation of functions that execute either during each render or after a certain subset of _props_ or _state_ changes and performs side effects.

* __useCallback__ - Creates a scoped callback and only re-creates it if a subset of _props_ or _state_ changes.

* __useReducer__ - Provides more advanced _state_ management using actions and a dispatcher. A lightweight [redux](https://redux.js.org/) or [flux](https://facebook.github.io/flux/) substitute.

* __useContext__ - Provides the ability to set values that can be used by child components without the need to pass all of the information down through _props_.

Some rules to remember when using Hooks:

* Hooks should only be used prior to the start of the `return` statement. Hooks need to be run in the same order during each render iteration so that the internal tracking of React can function.

* Hooks should not be called in any loop or conditional. Similar to above, Hooks need to be executed in a static order.

Additional Hook reference can be found on [React's Doc Website - Hooks](https://reactjs.org/docs/hooks-intro.html).
