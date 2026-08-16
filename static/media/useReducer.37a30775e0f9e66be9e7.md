# useReducer

`useReducer` provides more advanced _state_ management using actions and a dispatcher. A lightweight [redux](https://redux.js.org/) or [flux](https://facebook.github.io/flux/) substitute.

`useReducer` provides more specific control over changes the _state_ of an object, allowing a function (called a _reducer_) to be used to make updates to the _state_. Whereas the callback for `useState` blindly updates the _state_ to anything that is provided, the callback for `useReducer` calls a function we provide in order to update the _state_.

`useReducer` takes three arguments:

* Reducer function - this takes two arguments, the current _state_ and the dispatched action, and returns the updated _state_.

* Initial state - what value _state_ should be initially

* Init function - (optional) function used to provide a dynamic initial _state_

`useReducer` returns two arguments similar to `useState`:

* Current _state_ value

* Dispatch function to pass actions

Actions can be value and have any structure. Common practice is for actions to be an object with a string _type_ attribute and, optionally, a _payload_ attribute containing information to use during updating.

The _reducer_ pattern is similar to reduce functions in MapReduce or other languages.

`useReducer` can come in handy if there are a lot of _state_ values to track, or updating the _state_ has rules and side effects.

The __Basic Reducer__ example shows a common pattern of dispatching actions to modify a counter.

The __Init__ example shows how to use an init function to create the initial _state_. `startingCount` is used to seed the count, and the init function adds a counter for number of changes.

The __ToDo__ example shows how a todo list can be built using actions for _state_ management. By sharing the `dispatch` method, the ToDoList and the individual ToDos can make changes to the shared _state_.
