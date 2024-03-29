## Components

Components are the main building blocks for React. Components each represent a single HTML element (like `div` or `span`), which may or may not have additional HTML elements or components as children. These components should be kept small, simple, and focused on specific parts of functionality - which combine to create more complicated functionality.

There are two types of components: class components and functional components. Both types of components manage the same two sets of data: _props_ and _state_. More information will be provided later, but at a high level:
* _props_ is the information passed into a component from a parent.
* _state_ is the information tracked and managed by the component. This can be either used directly in the component, or passed to one or more children components.

__State and Props__ shows how _props_ make their way down from parent components into children, while _state_ stays inside of a component.

![State and Props](/first-to-react/diagrams/stateandprops.png)

__Flow through Render__ shows how a components passes information to child components via _props_, which can come from the components own _props_ and/or _state.

![Flow through Render](/first-to-react/diagrams/statepropsrender.png)

__React Data Flow__ shows how the _view_ of a component can make use of a callback to modify its _state_ and how _state_ and _props_ combine to create the view. As well as how a component takes in _props_, but maintains its own _state_.

![React Data Flow](/first-to-react/diagrams/reactdataflow.png)

#### Component Types

###### Class Components

Expanded components with access to the component lifecycle and _state_. Requires a render method which returns the HTML elements or other components to add to the web page.

###### Functional Components

Components based on a single function that returns the items to render. The return statement maps directly to the return statement in a class component's render method.

There are new items called ‘Hooks’ added in a recent React update that allow more React features without needing the class structure, which simplifies another group of components just slightly too complex for a strictly functional component.

#### Which to use?

Which to use will depend on the needs of each component. Is it a very basic display component? Functional component it is. Will it be managing a lot of _state_? Class component it is. These are _not_ strict rules, just guidance from experience. However, it is pretty straightforward to translate between the two if we find out that we need to switch if complexity changes.

Many examples will show both a class component and functional component in order to contrast between them and show how certain situations are handled in the different ways.

The __Minimal__ example below shows a minimal version of both a class component and functional component.

The __With Props__ example below shows how both class components and functional components access _props_.
