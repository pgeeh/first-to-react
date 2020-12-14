# Functional Components

Functional components do not have access to the same lifecycle methods as class components. Instead, they can be thought of as a more advanced render method. The entire method is run each time _state_ or _props_ change. 

Instead of the lifecycle methods, functional components have access to utilities called [Hooks](https://reactjs.org/docs/hooks-intro.html) that provide much of the same functionality, just in a different way - sometimes simpler, sometimes more complicated.

The Hooks provide ways to add a little functionality at a time, as well as optimize rendering. Hooks will get more detail in the later Hooks section.

The __Functional Components__ example below illustrates some of the lifecycle methods. Modify the `interval` prop to see how it affects the component.