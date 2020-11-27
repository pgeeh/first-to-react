import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {LiveProvider, LiveEditor, LiveError, LivePreview} from 'react-live';

import './Editor.scss';
import {readFile} from '../../utils';
import {useEffect} from 'react';

/**
 * Display an Editor
 * @param {object} props props for the object
 * @return {object}
 */
function Editor(props) {
  const {code} = props;

  const [content, setContent] = useState(null);

  useEffect(() => {
    readFile(code, setContent);
  }, []);

  if (content === null) {
    return (
      <center>Loading example...</center>
    );
  }

  return (
    <LiveProvider code={content} noInline={true} scope={{test: 'SOMETHING'}}>
      <div className="editorWrapper">
        <LiveEditor className="styledEditor" />
        <LivePreview className="styledPreview" />
        <LiveError className="styledError" />
      </div>
    </LiveProvider>
  );
}

Editor.propTypes = {
  code: PropTypes.string.isRequired,
};

export default Editor;
