# Props

The information passed into a component from a parent is called _props_. This value will always exist, but it may be empty - some components do not need any _props_ to function.

Information passed via _props_ should be treated as __read only__. Modifications to any _props_ values can cause unintended consequences, and will also generally be overwritten as soon as the component re-renders. Changes to _props_ will cause a component to re-render.

The __Basic Props__ below shows how _props_ can be passed to a component and accessed inside of the component.

These _props_ can be any JavaScript type or object, including HTML components or other React components. The __All Types of Props__ example shows this below.

_Props_ for a component can change without the component being re-created (unless certain _props_ like __key__ are changed) and if the component has any _state_, then it will remain. The __Props Change__ example below shows how a value can be calculated in the components on creation, but will not change when the _props_ change.
