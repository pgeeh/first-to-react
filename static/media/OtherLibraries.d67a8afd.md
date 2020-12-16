# Other Libraries

React's vast ecosystem extends into other areas, including and beyond the following.

__Maps__

[React-leaflet](https://react-leaflet.js.org/) provides React wrappers for the widely used [leaflet](https://leafletjs.com/) mapping library. This enables ease of adding and removing items from the map, as well as managing the map position and view.

[React-geo](https://github.com/terrestris/react-geo) provides React wrappers for the popular [OpenLayers](https://openlayers.org/) JavaScript mapping library.

__Static Website Generators__

React does not need to be used for dynamic websites; it can also be used for static sites. There exist many static site generators that work well with React.

[Gatsby](https://www.gatsbyjs.com/) is a very popular framework, which also provides other functionality. It is even used to create the official [React Website](https://reactjs.org/)!

[React-static](https://github.com/react-static/react-static) is another popular static site generator for React.

__Routing__

Single Page Applications are becoming more and more popular, and React makes it easy to create SPAs with its dynamic rendering and component management.

[React Router](https://reactrouter.com/) provides navigational components that allow a Single Page Application to act like a normal application (back button included!), but avoid costly refreshing and reloading.

__Drawing and Diagrams__

[Konva](https://konvajs.org/docs/react/index.html) has React wrappers for its powerful canvas-based drawing library.

[D3.js](https://d3js.org/) and [C3.js](https://c3js.org/) are two of the most popular drawing and charting libraries. There are no popular React wrapper libraries for either, but there are many guides on how to use the React lifecycle methods and Hooks to make use of them.

__Development Tools__

[create-react-app](https://github.com/facebook/create-react-app) was created by Facebook as a _very_ powerful utility to get a React application started and includes scripts to develop, test, and build the application. One command and we are ready to go.

[eslint](https://eslint.org/), while not directly a React library, can be very useful when developing React by providing consistency and hints when editing. Popular eslint configurations include:
* [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react), which comes automatically included with _create-react-app_ generated applications
* [eslint-config-google](https://github.com/google/eslint-config-google)
* [eslint-config-airbnb](https://github.com/airbnb/javascript)

__Browser Extensions - Development Tools__

Facebook has created an easy-to-use set of [development tools](https://www.npmjs.com/package/react-devtools) for React, which is also available as Firefox and Chrome extensions, which can greatly increase productivity and assist in debugging.

Redux has its own set of [development tools](https://github.com/reduxjs/redux-devtools), which is also available as Firefox and Chrome extensions. Similar to the React development tools, it provides an easy way to watch and track changes to the Redux store.

_Note about Dev Tools: In order for the dev tools to function, it needs access to the data for the website. Be sure to check with your system administrator prior to installing, as once installed, they can read data from any React or Redux website. In order to combat this, it may be possible to create a secondary profile that has the extensions and use that profile exclusively for development. Check out [Chrome Profiles](https://support.google.com/chrome/answer/2364824?co=GENIE.Platform%3DDesktop&hl=en) or [Firefox Profiles](https://support.mozilla.org/en-US/kb/profile-manager-create-remove-switch-firefox-profiles) for more information._
