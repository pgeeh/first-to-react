# Fragments

In the Components overview, we noted the following: _Components each represent a single DOM element_.

This is not entirely true. There exists a built-in React Component called a `Fragment` which allows for a single Component to add more than one element or Component to the DOM without unnecessary wrapping.

`Fragments` can be used via `React.Fragment` or an empty tag `<>`, as shown in __Basic Fragments__.

__Table Rows__ shows how a fragment can be used to specify the cells in a table without adding an unnecessary wrapper between the `tr` and `td` elements.
