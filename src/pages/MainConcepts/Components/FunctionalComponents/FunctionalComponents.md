# FunctionalComponents

Functional components do not have access to the same lifecycle methods as Class Components. Instead, they can be thought of as a more advanced render method. The entire method is run each time _state_ or _props_ update. 

Instead of the lifecycle methods, Functional Components have access to utilities called [hooks](https://reactjs.org/docs/hooks-intro.html) which provide much of the same functionality, just in a different way - sometimes simpler, sometimes more complicated.

The hooks provide ways to add a little functionality at a time, as well as optimize rendering. Hooks will get more detail in the later Hooks section.
