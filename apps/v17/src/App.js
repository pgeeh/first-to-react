import React, {useEffect, useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  useLocation,
  useParams,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import './App.scss';

import TableOfContents from './components/TableOfContents';
import Page from './components/Page';
import pages from './pages';
import General from './components/General';

import {fullLinkPath} from './utils';
import {PAGES} from './components/General';

const pagesMap = {};

/**
 * Dynamically create numerical IDs for the provided items
 * based on their ordering and nesting.
 * @param {array} items to add IDs
 * @param {string} prefix to include when creating the id
 */
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

// Add the ids to all of the pages.
addIds(pages);

/**
 * Create a wrapper to get the route params
 * @return {object} the wrapped page with route param
 */
function PageWrapper() {
  const {activeId} = useParams();
  const page = pagesMap[activeId] || null;

  if (page === null) {
    return (
      <General page={PAGES.HOME} />
    );
  }

  return (
    <Page key={activeId} page={page} />
  );
}

/**
 * Closes the sidebar whenever the route changes, so navigating on a
 * mobile-width screen doesn't leave the off-canvas menu open over the
 * newly selected page.
 * @param {object} props props for the object
 * @param {func} props.onNavigate called after every route change
 * @return {null} renders nothing
 */
function SidebarCloser({onNavigate}) {
  const location = useLocation();

  // Only re-run when the path actually changes, not when onNavigate
  // is re-created on parent render.
  useEffect(() => {
    onNavigate();
  }, [location.pathname]);

  return null;
}

SidebarCloser.propTypes = {
  onNavigate: PropTypes.func.isRequired,
};

/**
 * The Tutorial App
 * @return {object} The Tutorial App
 */
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // When the app mounts, clear the local storage so
  // all of the examples reset.
  useEffect(() => {
    localStorage.clear();
  }, []);

  // Manage the active page
  return (
    <div className="App">
      <Router>
        <Navbar bg='light' variant='light'>
          <Button
            variant="outline-secondary"
            className="sidebar-toggle d-lg-none"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label="Toggle navigation"
            aria-expanded={sidebarOpen}
          >
            ☰
          </Button>
          <Navbar.Brand to={fullLinkPath('/')} as={NavLink}>
            <img src={fullLinkPath('/f2r-logo.png')} style={{height: '40px'}} />
            First-To-React
          </Navbar.Brand>
          <Nav className="ml-auto">
            {/* Leaves the app for the landing/version-selector page,
                so this is a real link rather than a fullLinkPath route. */}
            <Nav.Link href="/first-to-react/">All Versions</Nav.Link>
          </Nav>
        </Navbar>
        <SidebarCloser onNavigate={() => setSidebarOpen(false)} />
        <div className="main">
          <aside className={'sidebar' + (sidebarOpen ? ' open' : '')}>
            <TableOfContents
              pages={pages}/>
          </aside>
          {sidebarOpen && (
            <div
              className="sidebar-backdrop"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <div className="content">
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
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
