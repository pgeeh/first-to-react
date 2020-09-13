import React, {useState} from 'react';
import './App.css';

import TableOfContents from './components/TableOfContents';
import Example from './components/Example';
import examples from './examples';

const examplesMap = {};

const addIds = (items, prefix = '') => {
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
 * The Tutorial App
 * @return {object} The Tutorial App
 */
function App() {
  // Manage the active example
  const [activeId, setActiveId] = useState(examples[0].id);

  return (
    <div className="App">
      <header>First To React</header>
      <div className="main">
        <TableOfContents
          setActiveId={setActiveId}
          activeId={activeId}
          examples={examples}/>
        <Example example={examplesMap[activeId]} />
      </div>
      <footer>Copyright &copy; 2020 Peter G. Hilton</footer>
    </div>
  );
}

export default App;
