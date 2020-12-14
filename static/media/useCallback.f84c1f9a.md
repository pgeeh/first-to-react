# useCallback

`useCallback` creates a scoped callback and only re-creates it if a subset of _props_ or _state_ changes.

This is useful for event handling within a component, as well as passing functions to child components to possibly be called inside of them.

`useCallback` takes two arguments in the same fashion as `useMemo`: a function and optionally an array of items to dictate when to re-create the function. It returns the function that can then be executed. The function itself does not need to take parameters, but can.

Best practices suggest always using the second argument to `useCallback` so that it is not needlessly re-created every render. Additionally, each piece of _props_ or _state_, whether it is a function or value, should be included in the second argument array.

__Basic Callback__ shows how to create a callback and use it.

__Passed Callback__ shows an example of passing a callback to a child that updates if _state_ changes in the parent. It includes a note that helps to show what happens if the callback is not updated correctly.

