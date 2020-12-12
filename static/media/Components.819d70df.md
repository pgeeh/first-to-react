## Components

Components are the main building blocks for React. Components each represent a single DOM element, which may or may not have DOM elements or additional Components as children. There are two types of Components: Class Components and Functional Components.

Both types of components manage the same two sets of data: _props_ and _state_. More information will be provided later, but at a high level:
* _props_ is the information passed into a Component from a parent.
* _state_ is the information tracked and managed by the Component. This can be either used directly in the component, or passed to one or more children Components.

![State and Props](/first-to-react/diagrams/stateandprops.png)

##### Class Components

Expanded components with more access to the component lifecycle and state.

##### Functional Components

Components based on a single function which returns the items to render.

There are new items called ‘Hooks’ added in a recent React update which allow more react features without needing the class structure, which simplifies another group of components just slightly too complex for a strictly functional component.

#### Which to use?

Which to use will depend on the needs of each component. Is it a very basic display component? Functional it is. Will it be managing a lot of state? Class component it is. These are not strict rules, just guidance from experience. However, it is pretty straight forward to translate between the two if you find out that you need to switch if complexity changes.

Many examples will show both a Class Component and Functional Component in order to constrast between them and show how certain situations are handled in the different ways.

The __Class Vs Functional__ example below shows basic version of each a Class Component and Functional Component.
