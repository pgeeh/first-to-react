# Composition over Inheritance

The React ecosystem and model drives us towards using Composition over Inheritance. Best practices say that there should be no inheritance, only composition. Much documentation and guidance denotes that the only time `extends` should be used is for the base `React.Component`. In the newer React system where hooks are becoming more popular with Functional Components, there is not need for `extends` at all.

Composition allows for reuse and wrapping, while keeping concerns separate. This harkens back to one of React's main design principles - small, contained components which can be augmented via _props_.

A normal inheritance model might be a `Button` which has an `onClick` handle, then a `BlueButton` and a `GreenButton` which extends `Button` to change the styling. In React, this is instead, using the same names, `BlueButton` and `GreenButton` which wrap a `Button` and provide styling. This is part of the example below.

By using the `children` _prop_, it is possible to wrap unknown or generic components and provide wrapped functionality.
