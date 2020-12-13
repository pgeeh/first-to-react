# useContext

`useContext` provides the ability to set values which can be used by children components without the need to pass all of the information down through _props_.

React can have complicated and deep Component trees. The ability to _provide_ information at one layer and _consume_ it at one or more locations below can greatly reduce complexity.

`useContext` keeps track of a single 'value' or piece of information - but that could be a single scalar, a function, or an object containing a lot of information. There are no built in ways to changs this value, so it has to be managed separately.

`useContext` can be used for a variety of uses, including:
* Shared state management - popular state management libraries, including Redux, make use of React Contexts to provide a simple context containing the current state and a method to make changes.
* Authentication information - storage of tokens to allow for API calls throughout the application

__Basic Context__ shows an example of using `useContext` to set and use a value deeper in the tree. Change, add, or remove values in the Prop Override to see it function.

__Consumer__ shows the same example but uses the Context.Consumer directly instead of `useContext`. This is not a common case, but is sometimes used.

__Todo Reducer__ shows a slight modification to the `useReducer` Todo example which accesses the information using a Context.

__Multi Context__ shows using the same context multiple times to provide separate values.
