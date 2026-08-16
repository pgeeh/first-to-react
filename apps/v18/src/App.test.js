import React from 'react';
import {render} from '@testing-library/react';
import App from './App';

test('renders the table of contents', () => {
  const {getByText} = render(<App />);
  const linkElement = getByText(/Alternatives/i);
  expect(linkElement).toBeInTheDocument();
});
