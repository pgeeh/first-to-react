import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  useParams,
} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import './App.scss';

import TableOfContents from './components/TableOfContents';
import Example from './components/Example';
import examples from './examples';
import General from './components/General';

import {fullLinkPath} from './utils';
import {PAGES} from './components/General';

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
      <Router>
        <Navbar bg='light' variant='light'>
          <Navbar.Brand to={fullLinkPath('/')} as={NavLink}>
            <img src={fullLinkPath('/f2r-logo.png')} style={{height: '40px'}} />
            First-To-React
          </Navbar.Brand>
        </Navbar>
        {/* <header>First To React</header> */}
        <Container className="main" fluid>
          <Row className="justify-content-center">
            <Col className="p-0 toc-col" xs={2}>
              <TableOfContents
                examples={examples}/>
            </Col>
            <Col className="p-0" xs={10}>
              <Switch>
                <Route path={fullLinkPath('/')} exact={true}>
                  <General page={PAGES.HOME} />
                </Route>
                <Route path={fullLinkPath('/example/:activeId')}>
                  <ExampleWrapper />
                </Route>
                <Route path={fullLinkPath('/about')} exact={true}>
                  <General page={PAGES.ABOUT} />
                </Route>
              </Switch>
            </Col>
          </Row>
        </Container>
      </Router>
    </div>
  );
}

export default App;
