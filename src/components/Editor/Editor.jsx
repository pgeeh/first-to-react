import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview,
} from 'react-live';
import vsDark from 'prism-react-renderer/themes/vsDark';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import {readFile} from '../../utils';
import './Editor.scss';

const EditorContext = React.createContext({});

const overrideNote = {
  '_note': 'Items here will override props from editor',
};

/**
 * Display the prop override
 * @param {object} children children to render and override
 * @return {object}
 */
function PropOverride({initial={}, children}) {
  const initialCombined =
    useMemo(() => ({...overrideNote, ...initial}), [initial]);
  const [scope, setScope] = useState(initialCombined);
  const [scopeText, setScopeText] = useState(JSON.stringify(scope, null, 2));
  const [scopeError, setScopeError] = useState(null);
  const {uniqueId} = useContext(EditorContext);

  const onScopeChange = useCallback((e) => {
    const update = e.target.value;
    setScopeText(update);

    try {
      const s = JSON.parse(update);
      localStorage.setItem(uniqueId, update);
      setScope(s);
      setScopeError(null);
    } catch (e) {
      setScopeError(String(e));
    }
  }, []);

  const onPretty = useCallback(() => {
    setScopeText(JSON.stringify(scope, null, 2));
  }, [scope]);

  const onReset = useCallback((value) => {
    onScopeChange({
      target: {
        value: initialCombined,
      },
    });
    setScopeText(JSON.stringify(initialCombined, null, 2));
  }, [initial]);

  useEffect(() => {
    const existing = localStorage.getItem(uniqueId);
    if (existing !== null) {
      setScopeText(existing);
      setScope(JSON.parse(existing));
    }
  }, [uniqueId]);

  // Convert to an array if not already one.
  const childs = Array.isArray(children) ? children : [children];

  return (
    <>
      <div className="propOverride">
        <div className="sectionHeader">
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
      <div className="actualPreview">
        <div className="previewHeader">
          <center>Live Preview</center>
        </div>
        {/* Add the scope to the children as props */}
        {childs.map((child, index) => React.cloneElement(child, {
          ...scope,
          key: 'child' + String(uniqueId) + String(index),
        }))}
      </div>
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
  const {code, name} = props;
  const uniqueId =
    useMemo(() => Math.floor(Math.random() * 10000000 + 1), []);

  const [content, setContent] = useState(null);
  const [originalContent, setOriginal] = useState(null);

  // Save content changes so when the scope changes, they do not get lost
  const onTransform = useCallback((edited) => {
    if (edited !== content) {
      setContent(edited);
    }

    // Do not make any actual transforms
    return edited;
  }, [content]);

  useEffect(() => {
    readFile(code, (data) => {
      console.log(code);
      setContent(data);
      setOriginal(data);
    });
  }, [code]);

  const onReset = useCallback(() => {
    setContent(originalContent);
  }, [originalContent]);

  useEffect(() => {
    // By returning a function, will be called on destruction
    return () => localStorage.removeItem(uniqueId);
  }, []);

  if (content === null) {
    return (
      <i>Loading example...</i>
    );
  }

  return (
    <LiveProvider
      code={content}
      noInline={true}
      scope={{PropOverride}}
      transformCode={onTransform}
      theme={vsDark}
    >
      <EditorContext.Provider value={{uniqueId}}>
        <Container className="editorContainer" fluid>
          {name ? <Row>
            <Col>
              <center><h3>{name}</h3></center>
            </Col>
          </Row> : null }
          <Row className="editorWrapper">
            <Col className="editorColumn">
              <div className="sectionHeader">
                <div></div>
                <div>Live Editor</div>
                <div onClick={onReset}>Reset</div>
              </div>
              <LiveEditor className="styledEditor" />
            </Col>
            <Col className="previewSection">
              <LiveError className="styledError" />
              <LivePreview className="styledPreview" />
            </Col>
          </Row>
        </Container>
      </EditorContext.Provider>
    </LiveProvider>
  );
}

Editor.propTypes = {
  code: PropTypes.string.isRequired,
  name: PropTypes.string,
};

export default Editor;
