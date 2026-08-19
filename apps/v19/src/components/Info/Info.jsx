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

/**
 * Render a paragraph, falling back to a div when it wraps a single
 * image - Zoom renders a div, and a div cannot be nested inside a p.
 * @param {object} children paragraph content
 * @return {object}
 */
function ParagraphRenderer({children}) {
  const kids = Array.isArray(children) ? children : [children];
  const isSoleImage = kids.length === 1 && kids[0]?.type === ImageRenderer;

  return isSoleImage ? <div>{children}</div> : <p>{children}</p>;
}

ParagraphRenderer.propTypes = {
  children: PropTypes.node,
};

const renderers = {
  code: CodeRenderer,
  img: ImageRenderer,
  p: ParagraphRenderer,
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
