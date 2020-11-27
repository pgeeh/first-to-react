import React from 'react';
import PropTypes from 'prop-types';

import Info from '../Info';
import Editor from '../Editor';

import './Example.scss';

/**
 * Display an Example
 * @param {object} props props for the object
 * @return {object}
 */
function Example(props) {
  const {example} = props;

  return (
    <div className="example">
      {example.info !== undefined && <Info source={example.info} />}
      {example.code !== undefined && <Editor code={example.code} />}
    </div>
  );
}

Example.propTypes = {
  example: PropTypes.object.isRequired,
};

export default Example;
