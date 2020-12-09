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
import Page from './components/Page';
import pages from './pages';
import General from './components/General';

import {fullLinkPath} from './utils';
import {PAGES} from './components/General';

const pagesMap = {};

const addIds = (items, prefix = '') => {
  for (let i = 1; i <= items.length; i++) {
    const item = items[i - 1];
    const id = prefix + String(i);
    item.id = id;
    if (item.children) {
      addIds(item.children, id + '.');
    }
    pagesMap[id] = item;
  }
};

addIds(pages);

/**
 * Create a wrapper to get the route params
 * @return {object} the wrapped page with route param
 */
function PageWrapper() {
  const {activeId} = useParams();
  console.log(activeId);
  return (
    <Page key={activeId} page={pagesMap[activeId] || null} />
  );
}

/**
 * The Tutorial App
 * @return {object} The Tutorial App
 */
function App() {
  // Manage the active page
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
                pages={pages}/>
            </Col>
            <Col className="p-0" xs={10}>
              <Switch>
                <Route path={fullLinkPath('/')} exact={true}>
                  <General page={PAGES.HOME} />
                </Route>
                <Route path={fullLinkPath('/page/:activeId')}>
                  <PageWrapper />
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
