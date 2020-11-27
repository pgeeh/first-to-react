import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {LiveProvider, LiveEditor, LiveError, LivePreview} from 'react-live';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import './Editor.scss';
import {readFile} from '../../utils';

/**
 * Display an Editor
 * @param {object} props props for the object
 * @return {object}
 */
function Editor(props) {
  const {code} = props;
  const originalScope = {test: 'SOMETHING'};

  const [content, setContent] = useState(null);
  const [scope, setScope] = useState(originalScope);
  const [scopeText, setScopeText] = useState(JSON.stringify(scope, null, 2));
  const [scopeError, setScopeError] = useState(null);

  const onScopeChange = useCallback((e) => {
    const update = e.target.value;

    try {
      const s = JSON.parse(update);
      setScope(s);
      setScopeText(JSON.stringify(s, null, 2));
      setScopeError(null);
    } catch (e) {
      setScopeText(update);
      setScopeError(String(e));
    }
  }, []);

  // Save content changes so when the scope changes, they do not get lost
  const onTransform = useCallback((edited) => {
    if (edited !== content) {
      setContent(edited);
    }

    // Do not make any transforms
    return edited;
  }, [content]);

  useEffect(() => {
    readFile(code, (c) => {
      setContent(c);
    });
  }, [code]);

  if (content === null) {
    return (
      <i>Loading example...</i>
    );
  }

  return (
    <LiveProvider
      code={content}
      noInline={true}
      scope={scope}
      transformCode={onTransform}
    >
      <Container className="editorContainer" fluid>
        <Row>
          <Col>
            <textarea
              className="styledScope"
              onChange={onScopeChange}
              value={scopeText}></textarea>
          </Col>
        </Row>
        <Row>
          <Col>
            {scopeError !== null ?
              <div className="styledError">Invalid Scope! {scopeError}</div> :
              null}
            <LiveError className="styledError" />
          </Col>
        </Row>
        <Row className="editorWrapper">
          <Col>
            <LiveEditor className="styledEditor" />
          </Col>
          <Col>
            <LivePreview className="styledPreview" />
          </Col>
        </Row>
      </Container>
    </LiveProvider>
  );
}

Editor.propTypes = {
  code: PropTypes.string.isRequired,
};

export default Editor;
