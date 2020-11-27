import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import {readFile} from '../../utils';

import './Info.scss';

/**
 * Display an info using Markdown
 * @param {object} props props for the object
 * @return {object}
 */
function Info(props) {
  const {source} = props;

  const [text, setText] = useState('_Loading info..._');

  useEffect(() => {
    readFile(source, setText);
  }, [source]);

  return (
    <ReactMarkdown className="info"
      source={text} />
  );
}

Info.propTypes = {
  source: PropTypes.string.isRequired,
};

export default Info;
