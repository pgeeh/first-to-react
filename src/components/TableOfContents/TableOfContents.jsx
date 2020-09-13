import React from 'react';
import PropTypes from 'prop-types';
import './TableOfContents.css';

import {activeClasses} from '../../utils';

/**
 * Display a selectable TableOfContents
 * @param {object} props props for the object
 * @return {object}
 */
function TableOfContents(props) {
  const {examples, activeId, setActiveId} = props;

  return (
    <div className="tableOfContents">
      {examples.map((example) => {
        return (
          <div
            key={example.id}
            onClick={() => setActiveId(example.id)}
            className={
              activeClasses({
                'active': example.id === activeId,
              })
            }
          >
            {example.id} - {example.name}
          </div>
        );
      })}
    </div>
  );
}

TableOfContents.propTypes = {
  examples: PropTypes.array.isRequired,
  activeId: PropTypes.string.isRequired,
  setActiveId: PropTypes.func.isRequired,
};

export default TableOfContents;
