import React, {useState} from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import './Info.css';

import {readFile} from '../../utils';

/**
 * Display an info using Markdown
 * @param {object} props props for the object
 * @return {object}
 */
function Info(props) {
  const {source} = props;

  const [text, setText] = useState('_Loading info..._');

  readFile(source, setText);

  return (
    <ReactMarkdown
      source={text} />
  );
}

Info.propTypes = {
  source: PropTypes.string.isRequired,
};

export default Info;
