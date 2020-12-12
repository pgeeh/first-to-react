## What is React?

“A JavaScript library for building user interfaces” - https://reactjs.org/

Combines stateful, efficient rendering with declarative 1-way data binding.

#### History

Originally created by Facebook, ReactJS eventually transitioned to open source. Now one of the most commonly used User Interface libraries, alongside Angular and VueJS.

#### Benefits

__Reuseable Components__ - Build up complex UIs piece by piece, each component having a singular purpose, and each component can be reused in different areas of the application.

__React Lifecycle__ - Manages _state_ and _props_ when components are added, updated, and removed in a consistent manner.

__Efficient__ - Using _state_, _props_, and a virtual DOM, ReactJS ensures that expensive changes to the actual DOM are kept to a minimum.

__Rich ecosystem__ - Many extensions and 3rd party libraries have been ported with React wrappers to enable many different pieces of functionality to be used in an application is a consistent pattern. More information later in React Ecosystem.

__Easy to Learn__ - React provides a small, but very powerful, set of capabilities. It does not require knowledge of the entire React capablity set to get started.

__Many Resources and Trainings__ - React is a widely used product and benefits from a very large number of freely available resources and trainings.

#### Drawbacks

__React is only the View in MVC__ - React provides management of the View, but to build a fully features website, other libraries are needed to complete the MVC pattern.

__Styling/Design Library Required__ - React does not have built in themes, Advanced UI Components, or style management. A 3rd Party library is needed. However, many of the popular UI Styling libraries are available with React wrappers, such as [Bootstrap](https://getbootstrap.com/) and [Material-UI](https://material-ui.com/).

__~~Class Structure Required for State Management~~__ - Until relatively recently, as soon as a component needed to manage _state_ or make use of other more advanced React functionality, this meant changing the component from a Functional Component to a Class Component.

However, the recent addition of Hooks for Functional Components has greatly simplified the management of state and allows state management without requiring the Class Component structure. Complicated Components which manage a lot of state or interactions (one example being large Controlled Forms) still benefit from the Class Component structure.
