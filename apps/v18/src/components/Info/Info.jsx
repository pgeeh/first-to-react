import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {vscDarkPlus} from 'react-syntax-highlighter/dist/cjs/styles/prism';

import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

import {readFile} from '../../utils';

import './Info.scss';

/**
 * Render a formatted code section, falling back to plain inline code
 * when there is no fenced-block language to highlight.
 * @param {string} className className carrying the `language-*` hint
 * @param {object} children code content
 * @return {object}
 */
function CodeRenderer({className, children, ...rest}) {
  const match = /language-(\w+)/.exec(className || '');

  if (!match) {
    return (
      <code className={className} {...rest}>
        {children}
      </code>
    );
  }

  return (
    <SyntaxHighlighter
      style={vscDarkPlus}
      language={match[1]}>
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  );
}

CodeRenderer.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

/**
 * Render an image
 * @param {string} alt
 * @param {string} src
 * @param {string} title
 * @return {object}
 */
function ImageRenderer({alt, src, title}) {
  return (
    <Zoom>
      <img
        alt={alt}
        src={src}
        title={(title || '') + ' HI'}
      />
    </Zoom>
  );
}

ImageRenderer.propTypes = {
  alt: PropTypes.string,
  src: PropTypes.string,
  title: PropTypes.string,
};

const renderers = {
  code: CodeRenderer,
  img: ImageRenderer,
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
    <div className="info">
      <ReactMarkdown components={renderers}>
        {text}
      </ReactMarkdown>
    </div>
  );
}

Info.propTypes = {
  source: PropTypes.string.isRequired,
};

export default Info;
