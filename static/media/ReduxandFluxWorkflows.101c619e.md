# Flux and Redux Workflows

React provides one-way data binding, which means that it uses data to help render the web page, but changes to the web page are not automatically transferred back to the data. 

For example, in the case of a text input in a form, React can set the value in the input, but when the input is changed, a function must be called and change the data in _state_ or another location appropriately, which then can be used by React to re-render.

Facebook created a flow to handle this called [Flux](https://facebook.github.io/flux/) that is used to facilitate and manage a '_unidirectional data flow_'. It is a set of standalone tools that can be used with any library, even though it was originally designed for use with React.

[Redux](https://redux.js.org/) is an evolution of Flux, and has a very similar flow. It is also a standalone library, but does have [wrappers](https://react-redux.js.org/) that make it easy to integrate with React and get started using.

![Flux and Redux](/first-to-react/diagrams/fluxreduxflow.png)

Both libraries have a very similar data flow and parts.

* __Action__ - These are created by either parts of the system or through user interactions. These are sent to the dispatcher.
* __Dispatcher__ - This sends all actions to the store (or multiple stores in the case of Flux) so they can update.
* __Store__ - contains the state of the application. After handling an action, it either notifies listeners that a change has been made (Flux) or changes are automatically picked up.
* __View__ - The View, which in the case of React are the components, uses the information from the Store(s) and handles user interactions.

[Reselect](https://github.com/reduxjs/reselect) is a powerful 'selector' library that helps to increase the performance of Flux, Redux, and other libraries by providing powerful [Memoization](https://en.wikipedia.org/wiki/Memoization) utilities. This helps reduce updates and renders across an application.
