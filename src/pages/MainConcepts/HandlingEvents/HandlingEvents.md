# Handling Events

React has _prop_ shortcuts for most DOM related events, and will automatically attach functions to the event handlers for the DOM elements.

They generally follow the pattern of `onAction` where action is `click` (`onClick`) or `change` (`onChange`).

This is most commonly used with `click` actions or form related actions, such as `change` or `blur`.

For Class Components, it is suggested to `bind` any methods which will be passed as _props_ to children in the constructor, so that they are not re-bound on every render.
