## Drawbacks

__JSX__ - React does not use separate files as templates with markup, but instead uses inline JSX, which is an extension of HTML to mix JavaScript and HTML. This can be useful once learned, but there is a sometimes a steep learning curve to it.

__State and Props Flow__ - One of React's best features can have a steep learning curve as well. The successful management of _state_ and _props_ is essential to successfully working with React, but can be a difficult set of concepts to learn.

__React is only the View in MVC__ - React provides management of the View, but to build a fully featured website, other libraries are needed to complete the MVC pattern.

__Styling/Design Library Required__ - React does not have built in themes, advanced UI components, or style management. A third party library is needed. However, many of the popular UI styling libraries are available with React wrappers, such as [Bootstrap](https://getbootstrap.com/) and [Material-UI](https://material-ui.com/).

__~~Class Structure Required for State Management~~__ - Until relatively recently, as soon as a component needed to manage _state_ or make use of other more advanced React functionality, this meant changing the component from a functional component to a class component.

However, the recent addition of Hooks for functional components has greatly simplified the management of _state_ and allows _state_ management without requiring the class component structure. Complicated components that manage a lot of _state_ or interactions (for instance, large controlled forms) still benefit from the class component structure.
