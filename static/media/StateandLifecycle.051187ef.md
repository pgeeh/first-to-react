# State and Lifecycle

In addition to _props_ they receive, Components can also keep track of their own information, using _state_.

A component's _state_ will persist as long as the component exists. If it is recreated, then its _state_ will be restarted as well.

_State_ is contained within the component and can be updated either using hooks (functional component) or setState (class component).

Class Components have a series of methods available to handle _state_ or _props_ changes and are documented in [React.Component](https://reactjs.org/docs/react-component.html). The example below uses `componentDidMount` and `componentWillUmount` in order to manage the interval for the Class Component.

Functional components use [hooks](https://reactjs.org/docs/hooks-intro.html) in order to manage many of the same features in a different way. These will be covered in more detail later. This example uses `useRef` and `useEffect` in order to accomplish the same functionality as the Class Component.
