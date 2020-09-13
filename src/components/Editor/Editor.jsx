import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {LiveProvider, LiveEditor, LiveError, LivePreview} from 'react-live';

import './Editor.css';
import {readFile} from '../../utils';

/**
 * Display an Editor
 * @param {object} props props for the object
 * @return {object}
 */
function Editor(props) {
  const {code} = props;

  const [content, setContent] = useState('Loading...');

  readFile(code, setContent);

  return (
    <LiveProvider code={content} noInline={true} scope={{test: 'SOMETHING'}}>
      <div className="editorWrapper">
        <LiveEditor />
        <LivePreview />
      </div>
      <LiveError />
    </LiveProvider>
  );
}

Editor.propTypes = {
  code: PropTypes.string.isRequired,
};

export default Editor;
