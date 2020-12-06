import React from 'react';
import PropTypes from 'prop-types';
import './Welcome.css';

/* eslint-disable max-len */
/**
 * Display an info using Markdown
 * @param {object} props props for the object
 * @return {object}
 */
function Welcome(props) {
  return (
    <div>
      <h2>Welcome to First-To-React</h2>
      <p>An interactive overview and intro into using and working with ReactJS.</p>
      <p>Use the Table of Contents on the Left to navigate the examples and descriptions.</p>
    </div>
  );
}

Welcome.propTypes = {
  content: PropTypes.string,
};

export default Welcome;
