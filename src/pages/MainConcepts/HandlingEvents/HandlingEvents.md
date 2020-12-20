# Handling Events

React has _prop_ shortcuts for most web page events, and will automatically attach functions to the event handlers for the HTML elements.

They generally follow the pattern of `onAction` where action is one of the HTML event listeners, such as `click` (`onClick`) or `change` (`onChange`).

This is most commonly used with `click` actions or form related actions, such as `change` or `blur`.

For class components, it is suggested to `bind` any methods that will be passed as _props_ to children in the constructor, so that they are not re-bound on every render.
