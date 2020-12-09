# Conditional Rendering

Components can be rendered conditionally based on _state_ or _props_. This allows the dynamic inclusion (or exclusion) of components.

Components can also be dynamically chosen and stored as variables. These variables must be capitalized, as React only allows components (other than the native HTML components) to be capitalized when called in a `render` function or returned from a functional render.

* `Dynamic` is a valid name, but `dynamic` is not.

`null` is an allowable value inside of a `render` method and can be used in place of a component which you wish to exclude.


