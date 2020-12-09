# F2R Intro

First-To-React contains interactive and on-the-fly compiled examples, right in your browser.

Most examples will only require clicking or typing into the `Live Preview` section. If you wish to go into more detail on a later pass-through, here are some details about the examples.

Or dive right in! It cannot break, just reload the page or go to another section and it will reload.

The left side of an example contains:
* Live Editor - The Live Editor is on the left side of the example area. You can edit and try out new ideas directly in the Live Editor and it will compile and render into the Live Preview on the right Side.
    * The Live Editor generally follows the structure of the components and other information at the top, and at the very bottom is the `render` method. This is the location to specify any top level component(s) you wish to render.
    * The `<PropOverride>` component is available and provides an ability to override the _props_ passed in to the top level components. It optionally takes in an `intial` property. It is edited via the `<PropOverride>` section described below.
    * __Important__: If a change is made in the Live Editor, it will completely re-render the Live Preview and remove all state. As well, it will reset the Prop Override section as the Prop Override is rendered as part of the example itself. Keep that in mind if you are editing the Override.
    * To access React pieces such as `useState` or `Component`, prefix them with `React.` - for instance `React.useState`. Examples on the web will generally directly import `useState` or `Component`, but the Live Editor library only provides the `React` module itself.

The right side of an example contains:
* Prop Override - If the `<PropOverride>` component is used in the `Live Editor` render method, then this section will appear and be populated with either an empty object or the object passed as the `initial` property. It will provide the contents of this object as properties to its children. In the example below, the `goal` and `when` properties of the intial object will be passed to the `Intro` component. If you edit them or add others in the `PropOverride` textarea, then those updates will be passed through.
    * If you make edits and want to _prettify_ the contents, hit the `Pretty` button.
    * If you want to reset to the original `initial` object, without causing the `Live Preview` to reset, hit the `Reset` button.
* Errors - If there is an error in either the Live Editor or the Prop Override section, then the Error section will appear with the error.
* Live Preview - This is what it is all about - The React Live Preview! The rendered components will be here to view or interract with
