# Props

The information passed into a component from a parent are called _props_.

This information should be treated as __read only__. Modifications to any _props_ values can cause unintended consequences, and will also generally be overwritten as soon as the component re-renders. Changes to props will cause a component to re-render.

The __Basic Props__ below shows how _props_ can be passed to a Component and accessed inside of the Component.

These props can be any Javascript type or object, including HTML DOM components or other React components. The __All Types of Props__ example shows this below.

Props for a Component can change without the Component being recreated (unless certain props like __key__ are changed) and if the component has any state, then it will remain. The __Props Change__ example below shows how a value can be calculated in the components on creation, but will not change when the props change.
