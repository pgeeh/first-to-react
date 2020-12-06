# Lists and Keys

React and JSX allow for dynamic Component generation using lists or arrays. Through various methods, an array of components can be created and placed as a child to another component. This is very useful when managing lists or tables of information. Each resulting Component can be different.

The only requirement is that each item in the resulting array which is passed to React has a `key` _prop_. This `key` is what React uses to track each Component, in order to correctly manage state of components which are added, removed, or even moved in the list.

In the example below, the `members` _prop_ is an array of strings. This array is mapped to an array of `ListItem` components with the appropriate _props_. This creates separate components for each entry in the array with their own _state_ and _props_.

The example below is illustrating the need to correctly set the `key` _prop_ on Components in a list so that React knows how to manage the state. 
* The Functional Component is correctly using a unique value from the source array to identify the `ListItem` (in this case since the entry itself is just a string, it is used directly)
* The Class Component is using the index in the Array as the `key`, which means the _state_ is tied to the location in the array, and not the value at that location.

To see this in action:
1. Click on each of the 4 different `ListItems` in each group a unique number of times.
1. Use the `Prop Override` to add your name into the `members` array in between `Paul` and `Ringo`.
1. Notice how the Functional Component creates a new item with a count of `0` in the middle. The Class Component, however, creates a new item in the middle, but with the count for `Ringo`, and `George` now has a count of `0`. This is because the _state_ of the component is tied to the index, and not the name.

_Note: This is not due to a difference in Functional vs Class Components, merely how the mapping is created_

The usages of Component Lists is very powerful, but care must be had when determining what to use as the `key` so that correct _state_ is maintained.
