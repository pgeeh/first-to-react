# useCallback

`useCallback` creates a scoped callback and only recreates it if a subset of _props_ or _state_ changes.

This is useful for event handling within a component, as well as passing functions to subcomponents to call.

`useCallback` takes two arguments in the same fashion as `useMemo`: a Function and optionally an array of items to dictate when to recreate the function. It returns the function which can then be executed. The Function itself does not need to take parameters, but can.

Best practices suggest always usign the second argument to `useCallback` so that it is not needlessly recreated every render. Additionally, each piece of _props_ or _state_, whether it be a function or value, should be included in the second argument array.

__Basic Callback__ shows how to create a callback and use it.

__Passed Callback__ shows an example of passing a callback to a child which updates if _state_ changes in the parent. It includes a note which helps to show what happens if the callback is not updated correctly.

