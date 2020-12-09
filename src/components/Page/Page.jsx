import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Info from '../Info';
import Editor from '../Editor';

import './Page.scss';
import {Button} from 'react-bootstrap';

/**
 * Manages a group of examples
 * @param {array} examples list of examples
 * @return {object}
 */
function ExampleGroup({examples}) {
  const [exampleNum, setExampleNum] = useState(0);

  if (examples.length < 1) {
    return (null);
  }

  return (
    <div>
      {/* Do not display the buttons if there is only one example. */}
      <div className={
        examples.length > 1 ? 'exampleSelectors' : 'exampleSelectors d-none'}
      >
        {examples.map((c, i) => {
          return (
            <div key={c.name + String(i)}>
              <Button
                variant='selector'
                className={i === exampleNum ? 'active' : ''}
                onClick={() => setExampleNum(i)}
              >
                {c.name}
              </Button>
            </div>
          );
        })}
      </div>
      <div>
        {examples.map((c, i) => {
          return (
            <div
              key={c.name + String(i)}
              // Do not remove the non-active examples - only hide them
              // so that their state and changes are not lost
              className={i == exampleNum ? '' : 'd-none'}
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
  examples: PropTypes.array.isRequired,
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
      {page.examples !== undefined && <ExampleGroup examples={page.examples} />}
    </div>
  );
}

Page.propTypes = {
  page: PropTypes.object.isRequired,
};

export default Page;
