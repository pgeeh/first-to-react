# State and Lifecycle

In addition to _props_ they receive, Components can also keep track of their own information, using _state_. Similar to _props_, the _state_ should be treated as __read only__ and only modified via the appropriate methods depending on Component type.

A component's _state_ will persist as long as the component exists. If it is recreated, then its _state_ will be restarted as well.

_State_ is contained within the component and can be updated either using `hooks` (functional component) or `setState` (class component).

Class Components have a series of methods available to handle _state_ or _props_ changes and are documented in [React.Component](https://reactjs.org/docs/react-component.html). 

Functional components use [hooks](https://reactjs.org/docs/hooks-intro.html) in order to manage many of the same features in a different way. 

__Basic State__ example shows the minimum to use and change state for both types of components. Class Components use `setState` to make modifications to state from anywhere within the class. Functional Components use the hook `React.useState` to track the state of a single item and make modifications to it. `useState` returns an array with the current value and a function to make changes.

__Multi State__ example shows how multiple pieces of state are managed for both types of components. Class Components use `setState` for both pieces, while Functional Components need to use the appropriate function returned by `useState` for each state value.

__Mount and Unmount__ shows an example of a timer interval used to count up from zero. They both accomplish the same thing, just using their own patterns.

* The Class Component makes use of two lifecycle methods `componentDidMount` and `componentWillUnmount`. These will be called when a component is added to the DOM and when it is about to be removed.
* The Functional Component makes use of two Hooks, `useRef` and `useEffect`. `useRef` provides a consistent object which can be used in the `interval` callback. `useEffect` serves two purposes: used to update the callback when count changes, and separately is used similar to `componentDidMount` and `componentWillUnmount`.

__Class Prop Update__ shows an example for `componentDidUpdate` which allows for checking if _props_ have changed and making and changes necessary. In this case, if the `interval` prop changes, then it resets the interval timing.

__Functional Prop Update__ shows a similar example to __Class Prop Update__, but using hooks to provide the same functionality. Instead of one method to handle all changes, we can use `useEffect` with only the properties we want to watch.
