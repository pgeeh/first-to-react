# useReducer

`useReducer` provides more advanced state management using actions and a dispatcher. A lightweight [reduxjs](https://redux.js.org/) or [flux](https://facebook.github.io/flux/) substitute.

`useReducer` provides more fine-grained control over changes the the state of an object, allowing a function (called a _reducer_) to be used to make updates to the state. Whereas the callback for `useState` blindly updates the state to anything that is provided, the callback for `useReducer` calls a function you provide in order to update the state.

`useReducer` takes three arguments:
* reducer function - this is called to update the state and is passed the current state and the dispatched action, and returns the updated state.
* initial state - what value state should be initially
* init function - function used to provide the initial state if it is dynamic

`useReducer` returns two arguments similar to `useState`:
* the current state value
* a dispatch function to pass actions.

Actions can be value and have any structure. Common practice is for actions to be an object with a string _type_ attribute and, optionally, a _payload_ attribute containing information to use during updating.

The _reducer_ pattern is similar to MapReducer or other reduce functions. Starting with an value, apply another value to it.

`useReducer` can come in handy if there are a lot of state values to track, or updating the state has rules and side effects.

__Basic Reducer__ shows a common example of dispatching actions to modify a counter using an action.

__Init__ shows an example of using an init function to create the initial state. Starting count is used to seed the count, and the init function adds a counter for number of changes.

__Todo__ shows an example of a todo list using actions for state management. By sharing the `dispatch` method, the TodoList and the individual Todos can make changes to the shared state.
