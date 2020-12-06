import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {vscDarkPlus} from 'react-syntax-highlighter/dist/esm/styles/prism';

import {readFile} from '../../utils';

import './Info.scss';

/**
 * Render a formatted code section
 * @param {string} language language for the block
 * @param {string} value content for the code block
 * @return {object}
 */
function CodeRenderer({language, value}) {
  return (
    <SyntaxHighlighter
      style={vscDarkPlus}
      language={language}>
      {value}
    </SyntaxHighlighter>
  );
}

CodeRenderer.propTypes = {
  language: PropTypes.string,
  value: PropTypes.string,
};

const renderers = {
  code: CodeRenderer,
};

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
    <ReactMarkdown
      className="info"
      renderers={renderers}
      source={text} />
  );
}

Info.propTypes = {
  source: PropTypes.string.isRequired,
};

export default Info;
