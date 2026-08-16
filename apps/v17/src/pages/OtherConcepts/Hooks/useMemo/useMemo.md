# useMemo

`useMemo` provides [memoization](https://en.wikipedia.org/wiki/Memoization) to reduce unnecessary or expensive recalculation of values.

`useMemo` takes either one or two arguments:
* Memo function used to compute the desired value, which must return the computed value
* (Optionally) An array of values to track for which to re-run the memo function

Second argument options:
* If no second parameter is run, then the memo function is executed each render. 
* If an empty array is provided, then the memo function is run once at the first render and then never again (since the array will continue to be empty and no values changed).
* If an array of values is passed, then the memo function will be re-run whenever one of these values changes.

`useMemo` should be used only to calculate values - there should be no side effects caused by the memo function provided to `useMemo`. `useEffect` should be used instead in these cases (for instance, to update _state_ if _props_ change).

It is a general rule of thumb that any value used inside of the memo function should be passed as part of the second argument array so that the values are recomputed accordingly.

The __Basic Memo__ example shows how the memo can be used to calculate a secondary value.

The __Advanced Memo__ example shows the different side effects of including or excluding values from the second argument array.
