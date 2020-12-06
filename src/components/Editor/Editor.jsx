import React, {useState, useEffect, useCallback, useContext} from 'react';
import PropTypes from 'prop-types';
import {LiveProvider, LiveEditor, LiveError, LivePreview} from 'react-live';
import vsDark from 'prism-react-renderer/themes/vsDark';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
// import assign from 'assign-deep';

import {readFile} from '../../utils';
import './Editor.scss';

const OverrideContext = React.createContext({});

/**
 * Display the prop override
 * @param {object} children children to render and override
 * @return {object}
 */
function PropOverride({children}) {
  const initial = useContext(OverrideContext);
  const [scope, setScope] = useState(initial);
  const [scopeText, setScopeText] = useState(JSON.stringify(scope, null, 2));
  const [scopeError, setScopeError] = useState(null);

  const onScopeChange = useCallback((e) => {
    const update = e.target.value;
    setScopeText(update);

    try {
      const s = JSON.parse(update);
      setScope(s);
      setScopeError(null);
    } catch (e) {
      setScopeError(String(e));
    }
  }, []);

  const onPretty = useCallback(() => {
    setScopeText(JSON.stringify(scope, null, 2));
  }, [scope]);

  const onReset = useCallback(() => {
    setScope(initial);
    setScopeText(JSON.stringify(initial, null, 2));
  }, [initial]);

  // Convert to an array if we did not already have one.
  const childs = Array.isArray(children) ? children : [children];

  return (
    <>
      <div className="propOverride">
        <div className="overrideHeader">
          <div onClick={onPretty}>Pretty</div>
          <div>Prop Override</div>
          <div onClick={onReset}>Reset</div>
        </div>
        <textarea
          style={{width: '100%'}}
          rows={8}
          className="styledOverride"
          onChange={onScopeChange}
          value={scopeText}></textarea>
        {scopeError !== null ?
              <div className="styledError">Invalid Scope! {scopeError}</div> :
              null}
      </div>
      <div className="previewHeader">
        <center>Live Preview</center>
      </div>
      {childs.map((child) => React.cloneElement(child, scope))}
    </>
  );
}

PropOverride.propTypes = {
  initial: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

/**
 * Display an Editor
 * @param {object} props props for the object
 * @return {object}
 */
function Editor(props) {
  const {code} = props;
  const originalOverride = {
    '_note': 'Items here will override props from editor',
  };

  const [content, setContent] = useState(null);

  // Save content changes so when the scope changes, they do not get lost
  const onTransform = useCallback((edited) => {
    if (edited !== content) {
      setContent(edited);
    }

    // Do not make any actual transforms
    return edited;
  }, [content]);

  useEffect(() => {
    readFile(code, setContent);
  }, [code]);

  if (content === null) {
    return (
      <i>Loading example...</i>
    );
  }

  // window.scope = {name: 'Bob'};

  return (
    <LiveProvider
      code={content}
      noInline={true}
      scope={{PropOverride}}
      transformCode={onTransform}
      theme={vsDark}
    >
      <OverrideContext.Provider value={originalOverride}>
        <Container className="editorContainer" fluid>
          <Row className="editorWrapper">
            <Col>
              <LiveEditor className="styledEditor" />
            </Col>
            <Col className="previewSection">
              <LiveError className="styledError" />
              <LivePreview className="styledPreview" />
            </Col>
          </Row>
        </Container>
      </OverrideContext.Provider>
    </LiveProvider>
  );
}

Editor.propTypes = {
  code: PropTypes.string.isRequired,
};

export default Editor;
