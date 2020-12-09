import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Info from '../Info';
import Editor from '../Editor';

import './Page.scss';
import {Button} from 'react-bootstrap';

/**
 * Manages a group of examples
 * @param {array} code code examples
 * @return {object}
 */
function ExampleGroup({code}) {
  const [codeNum, setCodeNum] = useState(0);

  if (code.length < 1) {
    return (null);
  }

  return (
    <div>
      {/* Do not display the buttons if there is only one example. */}
      <div className={
        code.length > 1 ? 'exampleSelectors' : 'exampleSelectors d-none'}
      >
        {code.map((c, i) => {
          return (
            <div key={c.name + String(i)}>
              <Button
                variant='selector'
                className={i === codeNum ? 'active' : ''}
                onClick={() => setCodeNum(i)}
              >
                {c.name}
              </Button>
            </div>
          );
        })}
      </div>
      <div>
        {code.map((c, i) => {
          return (
            <div
              key={c.name + String(i)}
              // Do not remove the non-active examples - only hide them
              // so that their state and changes are not lost
              className={i == codeNum ? '' : 'd-none'}
            >
              <Editor key={c.name + String(i)} {...c}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}

ExampleGroup.propTypes = {
  code: PropTypes.array.isRequired,
};

/**
 * Display a Page
 * @param {object} props props for the object
 * @return {object}
 */
function Page(props) {
  const {page} = props;

  return (
    <div className="page">
      {page.info !== undefined && <Info source={page.info} />}
      {page.code !== undefined && <ExampleGroup code={page.code} />}
    </div>
  );
}

Page.propTypes = {
  page: PropTypes.object.isRequired,
};

export default Page;
