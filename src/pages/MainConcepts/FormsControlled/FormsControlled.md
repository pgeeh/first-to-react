# Controlled Forms

React can manage forms by providing the values and listening for changes via the various event listeners. When used in this manner, the form inputs are said to be _controlled_. 

They can instead be left [uncontrolled](https://reactjs.org/docs/uncontrolled-components.html), where the inputs manage their own data and then their values are accessed on demand. This can be useful for basic forms where nothing needs to be tracked until the user is finished adding data.

The example below passes in the initial values for `name` and `age` then controls the inputs via _state_. If the _props_ are changed, notice how the values in the `input` fields will not be updated until `Reset` is pressed. This is one method for managing the prop changes.

Additional information can be found on the [React Forms Documentation](https://reactjs.org/docs/forms.html).
