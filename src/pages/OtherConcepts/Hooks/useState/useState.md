# useState

`useState` provides state management for a Functional Component. Each invocation of `useState` takes an initial value and returns an array of two items:
* Current Value
* Function to update the value

`useState` and its returned update function are _type-dumb_ - they do not care what value is passed and whether it has the same type as the previous or inital value, so it is up to the caller to ensure that the data type is correct.

__Basic State__ shows an example of `useState`. Use the Prop Override to change the `value` between a boolean `true`/`false`, string, or number and see how the state update method will take any of them.
