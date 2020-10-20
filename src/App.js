import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from 'react-router-dom';
import './App.css';

import TableOfContents from './components/TableOfContents';
import Example from './components/Example';
import examples from './examples';
import Welcome from './components/Welcome';

const examplesMap = {};

const addIds = (items, prefix = '') => {
  console.log(items);
  for (let i = 1; i <= items.length; i++) {
    const item = items[i - 1];
    const id = prefix + String(i);
    item.id = id;
    if (item.children) {
      addIds(item.children, id + '.');
    }
    examplesMap[id] = item;
  }
};

addIds(examples);

/**
 * Create a wrapper to get the route params
 * @return {object} the wrapped example with route param
 */
function ExampleWrapper() {
  const {activeId} = useParams();
  console.log(activeId);
  return (
    <Example key={activeId} example={examplesMap[activeId] || null} />
  );
}

/**
 * The Tutorial App
 * @return {object} The Tutorial App
 */
function App() {
  // Manage the active example
  return (
    <div className="App">
      <header>First To React</header>
      <Router>
        <div className="main">
          <TableOfContents
            examples={examples}/>
          <Switch>
            <Route path={'/'} exact={true}>
              <Welcome />
            </Route>
            <Route path={'/app/:activeId'}>
              <ExampleWrapper />
            </Route>
          </Switch>
        </div>
      </Router>
      <footer>Copyright &copy; 2020 Peter G. Hilton</footer>
    </div>
  );
}

export default App;
