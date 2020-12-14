# Lists and Keys

React and JSX allow for dynamic component generation using lists or arrays. Through various methods an array of components can be created and placed as children to another component. This is very useful when managing lists or tables of information. Each resulting component can be different.

The only requirement is that each item in the resulting array that is passed to React has a `key` _prop_. This `key` is what React uses to track each component, in order to correctly manage _state_ of components that are added, removed, or even moved in the source list.

In the example below, the `members` _prop_ is an array of strings. This array is mapped to an array of `ListItem` components with the appropriate _props_. This creates separate components for each entry in the array with their own _state_ and _props_.

The examples below illustrate the need to correctly set the `key` _prop_ on components in a list so that React knows how to manage the _state_. 
* The components in __Correct Keys__ correctly use a unique value from the source array to identify the `ListItem` (in this case, since the entry itself is just a string, it is used directly).

* The components in __Incorrect Keys__ use the index in the array as the `key`, which means the _state_ is tied to the location in the array, and not the value at that location.

To see this in action:

1. Click on each of the four different `ListItems` in each group a unique number of times.

1. Use the `Prop Override` to add a name into the `members` array in between `Paul` and `Ringo`.

1. Notice how the __Correct Keys__ example creates a new item with a count of `0` in the middle. The __Incorrect Keys__ example, however, creates a new item in the middle, but with the count for `Ringo`, and `George` now has a count of `0`. This is because the _state_ of the component is tied to the index, and not the name.

The usages of component Lists is very powerful, but care must be had when determining what to use as the `key` so that correct _state_ is maintained.

Keys can be a composite of multiple values, which allows for forced re-creation of components, which can be useful in certain circumstances. The __Forced Key Change__ example shows how a prop (could also be a _state_ value) is used to create the key. If the `keyBase` prop changes, then the components will re-create as React will think that they are different items because their `key` changed.

The __Sorted__ example shows how the key can be used to ensure that _state_ is kept with the right component. By changing the value of `sort` in the Prop Override textarea from `false` to `true`, the array of `members` will optionally be sorted prior to display. Even though this is the case, React will correctly maintain the correct number of clicks for each `member`, even if the order in the list changes, because the `key` will stay consistent. Try clicking on the different rows, adding and removing people from the `members` list, and changing `sort`. The clicks should persist across changes - except if we remove someone from the list and re-add them, then the _state_ is lost because the component was removed entirely.