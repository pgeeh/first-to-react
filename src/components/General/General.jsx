import React from 'react';
import PropTypes from 'prop-types';
import './General.css';
import Example from '../Example';

import Home from './Home.md';
import About from './About.md';

export const PAGES = {
  HOME: 'home',
  ABOUT: 'about',
};

const PAGE_CONTENTS = {
  [PAGES.HOME]: Home,
  [PAGES.ABOUT]: About,
};

/**
 * Display an info using Markdown
 * @param {string} page page identifier
 * @return {object}
 */
function General({page}) {
  return (
    <Example example={{info: PAGE_CONTENTS[page] || Home}} />
  );
}

General.propTypes = {
  page: PropTypes.string.isRequired,
};

export default General;
