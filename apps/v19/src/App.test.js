import React from 'react';
import {render} from '@testing-library/react';
import App from './App';

// react-bootstrap's Navbar pulls in `uncontrollable`, a transitive
// dependency shared (hoisted to the workspace root by npm) across all
// three apps. Vitest runs test files as plain Node CJS for library code
// under node_modules rather than through Vite's own resolver, so
// `uncontrollable`'s own `require('react')` call resolves natively from
// wherever *it* physically lives - the hoisted root copy - rather than
// this app's nested React 19 copy, hitting "Invalid hook call" even
// though the real (Vite-bundled) app has no such issue - confirmed
// visually with Playwright against a production build, no console
// errors. Mock just Navbar to sidestep it; real Navbar rendering is
// exercised in the browser instead, the same tradeoff already made for
// react-markdown/react-live rendering in earlier phases.
vi.mock('react-bootstrap/Navbar', () => {
  const Navbar = ({children, ...props}) => <nav {...props}>{children}</nav>;
  Navbar.Brand = ({as: Component = 'a', children, ...props}) => (
    <Component {...props}>{children}</Component>
  );
  return {default: Navbar};
});

test('renders the table of contents', () => {
  const {getByText} = render(<App />);
  const linkElement = getByText(/Alternatives/i);
  expect(linkElement).toBeInTheDocument();
});
