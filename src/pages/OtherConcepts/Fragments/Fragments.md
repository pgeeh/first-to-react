# Fragments

In the components overview, we noted the following: _Components each represent a single DOM element_.

This is not entirely true. There exists a built-in React component called a `Fragment` that allows for a single component to add more than one element or component to the DOM without unnecessary wrapping.

`Fragments` can be used via `React.Fragment` or an empty tag `<>`, as shown in __Basic Fragments__.

__Table Rows__ shows how a fragment can be used to specify the cells in a table without adding an unnecessary wrapper between the `tr` and `td` elements.
