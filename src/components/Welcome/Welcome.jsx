import React from 'react';
import PropTypes from 'prop-types';
import './Welcome.css';


/**
 * Display an info using Markdown
 * @param {object} props props for the object
 * @return {object}
 */
function Welcome(props) {
  return (
    <div>Hi Friends</div>
  );
}

Welcome.propTypes = {
  content: PropTypes.string,
};

export default Welcome;
