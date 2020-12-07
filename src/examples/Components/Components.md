## Components

Components each represent a single DOM element, which may or may not have DOM elements or additional Components as children.

#### Functional Components

Components based on a single function which returns the items to render.

Generally used for more basic components

#### Class Components

Expanded components with more access to the component lifecycle and state.

Examples:

Basic button

More advanced class which keeps state but updates if props change

There are new items called ‘Hooks’ added in a recent React update which allow more react features without needing the class structure, which simplifies another group of components just slightly too complex for a strictly functional component. Will go over these at the end.

#### Which to use?

Which to use will depend on the needs of each component. Is it a very basic display component? Functional it is. Will it be managing a lot of state? Class component it is. These are not strict rules, just guidance from experience. However, it is pretty straight forward to translate between the two if you find out that you need to switch.

Many examples will show both a Class Component and Functional Component in order to constrast between them and show how certain situations are handled in the different ways.
