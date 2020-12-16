## What is React?

“A JavaScript library for building user interfaces” - https://reactjs.org/

Combines stateful, efficient rendering and DOM management with declarative one-way data binding.

#### History

Originally created by Facebook, React eventually transitioned to [open source](https://github.com/facebook/react). It is one of the most widely used user interface libraries. 

It is most commonly grouped with Angular and VueJS.

A rich ecosystem of libraries, frameworks, and tools have been built around and using React. Many of the most used websites in the world use React.

#### Basics

React manages the [DOM (document object model)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) using components, which represent one or more native HTML elements and their configuration, event handling, and more. 

Components can be nested, building up complex designs by starting with small reusable components which are combined into progressively larger components.

React Components main concepts include:

* _props_ provided from either parent components or the initial entry point
* _state_ which is managed and maintained within a component
* Render method which denotes the HTML elements or child components to display, and is re-run each time changes are made to _props_ or _state_

![State and Props](/first-to-react/diagrams/stateandprops.png)

![Flow through Render](/first-to-react/diagrams/statepropsrender.png)

