# Components and Props

The information passed into a component from a parent are called _properties_, or _props_ for short. 

This information should be treated as read only. Modifications to any _props_ values can cause unintended consequences, and will also generally be overwritten as soon as the component re-renders.

These props can be any Javascript type or object, including HTML DOM components or other React components.

The example below shows how _props_ can be passed to a Component and accessed inside of the Component.
