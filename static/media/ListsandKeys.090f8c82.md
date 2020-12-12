# Lists and Keys

React and JSX allow for dynamic Component generation using lists or arrays. Through various methods, an array of components can be created and placed as a child to another component. This is very useful when managing lists or tables of information. Each resulting Component can be different.

The only requirement is that each item in the resulting array which is passed to React has a `key` _prop_. This `key` is what React uses to track each Component, in order to correctly manage state of components which are added, removed, or even moved in the source list.

In the example below, the `members` _prop_ is an array of strings. This array is mapped to an array of `ListItem` components with the appropriate _props_. This creates separate components for each entry in the array with their own _state_ and _props_.

The examples below illustrate the need to correctly set the `key` _prop_ on Components in a list so that React knows how to manage the state. 
* The Components in __Correct Keys__ correctly use a unique value from the source array to identify the `ListItem` (in this case since the entry itself is just a string, it is used directly)
* The Components in __Incorrect Keys__ use the index in the Array as the `key`, which means the _state_ is tied to the location in the array, and not the value at that location.

To see this in action:
1. Click on each of the 4 different `ListItems` in each group a unique number of times.
1. Use the `Prop Override` to add your name into the `members` array in between `Paul` and `Ringo`.
1. Notice how the __Correct Keys__ Example creates a new item with a count of `0` in the middle. The __Incorrect Keys__ example, however, creates a new item in the middle, but with the count for `Ringo`, and `George` now has a count of `0`. This is because the _state_ of the component is tied to the index, and not the name.

The usages of Component Lists is very powerful, but care must be had when determining what to use as the `key` so that correct _state_ is maintained.

Keys can be a composite of multiple values, which allows for forced recreation of components, which can be useful in certain circumstances. __Forced Key Change__ example shows how a prop (could also be a state value) is used to create the key. If the `keyBase` prop changes, then the components will recreate as React will think that they are different items because their `key` changed.

__Sort Example__ shows how the key can be used to ensure that state is kept with the right component. By changing the value of `sort` in the Prop Override textarea from `false` to `true`, the array of `members` will optionally be sorted prior to display. Even though this is the case, React will correctly maintain the correct number of clicks for each `member`, even if the order in the list changes, because the `key` will stay consistent. Try clicking on the different rows, adding and removing people from the `members` list, and changing `sort`. The clicks should persist across changes - except if you remove someone from the list and re-add them, then the state is lost because the component was removed entirely.