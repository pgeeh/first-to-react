# Composition over Inheritance

The React ecosystem and model drives us towards using composition over inheritance. Best practices say that there should be no inheritance, only composition. Much documentation and guidance denotes that the only time `extends` should be used is for the base `React.Component`. In the newer React system where Hooks are becoming more popular with functional components, there is not need for `extends` at all.

Composition allows for reuse and wrapping, while keeping concerns separate. This harkens back to one of the main design principles of React - small, contained components that can be augmented via _props_.

A normal inheritance model might be a `Button` that has an `onClick` handler, then a `BlueButton` and a `GreenButton` that extend `Button` to change the styling. In React, instead (using the same names) `BlueButton` and `GreenButton` wrap a `Button` and provide styling to it via _props_. This is part of the example below.

By using the `children` _prop_, it is possible to wrap unknown components and provide wrapped functionality. This is very common in UI components such as those from `react-bootstrap` or `material-ui`.

The __Composition__ example below shows how components can be composed and how _children_ should be passed through. The `TrackedButton` and other `Buttons` shows a common practice for components to pass through all extra _props_ to the inner components (other than _props.children_, which will already have everything they need).
