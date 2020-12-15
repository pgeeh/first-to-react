# Class Components

Class components extend `React.Component` and provide access to all of the [lifecycle methods](https://reactjs.org/docs/state-and-lifecycle.html).

As the goal of React is to use more simple components, and functionality such as Hooks have become available with functional components, class components are becoming less common.

Class components still have their place when complicated lifecycle management comes into play, as well as when a lot of _state_ needs to be managed. Depending on the case, it may be easier to manage via Hooks or the class lifecycle methods.

The diagram below lists the most common class lifecycle methods and when they happen.

![React Data Flow](/first-to-react/diagrams/react-lifecycle-light.png)
_Diagram Credit to [wojtekmaj](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)_

Important to remember when working with class components:
* `this` is required to access members of the class in class functions, including render.
* Usage of class functions as event handlers requires `bind` in order to maintain scope.

The __Class Components__ example below illustrates some of the lifecycle methods. Modify the `interval` prop to see how it affects the component. 
