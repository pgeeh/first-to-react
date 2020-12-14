# useEffect

`useEffect` allows creation of functions that execute either during each render or after a certain subset of _props_ or _state_ changes. The provided function is allowed to cause side effects, including:

* Make calls to local _state_ callbacks
* Call functions passed via _props_
* Start subscriptions handlers
* Request data from an external source

`useEffect` takes two arguments:
* Effect function to call that performs desired effects. This function can return a _cleanup_ function that will be called when the component is being unmounted.
* (Optional) Array of values that, if changed, will cause the effect to be called again.

The functionality of the second parameter of `useEffect` follows the same pattern as `useMemo`, so refer to that page for more information.

As with `useMemo`, any values from _props_ or _state_ that are used inside of the function should be included in the second argument array.

The __Interval__ example shows how an effect can be used to create, update, and cleanup an interval.

The __Fetch__ example shows how `useEffect` can be used to fetch data from an API based on _props_. Clicking Next or Prev will cause new data to be fetched using `useEffect`. _Note: There is a slight delay built in so that it is visible as the data is returned._
