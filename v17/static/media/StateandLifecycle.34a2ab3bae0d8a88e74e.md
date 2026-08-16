# State and Lifecycle

In addition to _props_ they receive, components can also keep track of their own information, using _state_. Similar to _props_, the _state_ should be treated as __read only__ and only modified via the appropriate methods depending on component type.

A component's _state_ will persist as long as the component exists. If it is re-created, then its _state_ will be restarted as well.

_State_ is contained within the component and can be updated either using Hooks (functional component) or `setState` (class component).

Class components have a series of methods available to handle _state_ or _props_ changes and are documented in [React.Component](https://reactjs.org/docs/react-component.html). 

Functional components use [Hooks](https://reactjs.org/docs/hooks-intro.html) in order to manage many of the same features in a different way. 

__Basic State__ example shows the minimum to use and change _state_ for both types of components. Class components use `setState` to make modifications to _state_ from anywhere within the class. Functional components use the Hook `React.useState` to track the _state_ of a single item and make modifications to it. `useState` returns an array with the current value and a function to make changes.

__Multi State__ example shows how multiple pieces of _state_ are managed for both types of components. Class components use `setState` for both pieces, while functional components need to use the appropriate function returned by `useState` for each _state_ value.

__Mount and Unmount__ shows an example of a timer interval used to count up from zero. They both accomplish the same thing, just using their own patterns.

* A class component makes use of two lifecycle methods `componentDidMount` and `componentWillUnmount`. These will be called when a component is added to the web page and when it is about to be removed.
* A functional component makes use of two Hooks, `useRef` and `useEffect`. 

    * `useRef` provides a consistent object that can be used in the `interval` callback. 

    * `useEffect` serves two purposes: it is used to update the callback when the count changes, and separately is used similar to the `componentDidMount` and `componentWillUnmount` class lifecycle methods.

__Class Prop Update__ shows an example for `componentDidUpdate` that allows for checking if _props_ has changed and making any changes. In this case, if the `interval` _prop_ changes, then it resets the interval timing.

__Functional Prop Update__ shows a similar example to __Class Prop Update__, but using Hooks to provide the same functionality. Instead of one method to handle all changes, we can use `useEffect` with only the properties we want to watch.
