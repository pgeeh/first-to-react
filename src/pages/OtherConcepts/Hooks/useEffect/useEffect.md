# useEffect

`useEffect` allows creation of functions which execute either during each render or after a certain subset of _props_ or _state_ changes. The provided function is allowed to cause side effects such as making calls to state callbacks, functions passed via _props_, subscription handlers, or requesting data from an external source.

`useEffect` takes two arguments:
* Function to call which performs desired effects. This function can return a _cleanup_ function which will be called when the Component is being unmounted.
* (Optional) Array of values which, if changed, will cause the effect to be called again.

The functionality of the second parameter of `useEffect` follows the same pattern as `useMemo`, so refer to that page for more information.

As with `useMemo`, and values from _props_ or _state_ which are used inside of the Function should be included in the second argument array.

The __Interval__ example shows how an effect can be used to create, update, and cleanup an interval.

The __Fetch__ example shows how `useEffect` can use used to fetch data based on _props_. Clicking Next or Prev will cause new data to be fetched using `useEffect`. Note: There is a slight delay built-in so that it is visible as the data is returned.
