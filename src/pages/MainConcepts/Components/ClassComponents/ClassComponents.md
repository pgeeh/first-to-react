# ClassComponents

Class-based components extend `React.Component` and provide access to all of the [lifecyle methods](https://reactjs.org/docs/state-and-lifecycle.html).

Class Components can be useful as components get more complicated, but as the goal of React is to use more simpler Components and functionality such as Hooks have become available, Functional Components are becoming much more common.

Class Components still have their place when complicated lifecyle management come into play, as well as when a lot of state needs to be managed. React Hooks only go so far to replacing the class lifecycle methods.

Important to remember when working with Class Components:
* `this` is required to access members of the class in class functions, including render.
* Usage of class functions as event handlers requires `bind` in order to maintain scope.

The __Class Components__ example below illustrates some of the lifecycle methods. Modify the `interval` prop to see how it affects the component. 
