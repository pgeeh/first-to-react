import React from 'react';
import {
  NavLink,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import './TableOfContents.css';


/**
 * A custom standardized link
 * @param {object} props props to pass through
 * @return {object} the custom link
 */
function CustomLink(props) {
  return (
    <NavLink
      activeClassName='active'
      {...props}
    >
      {props.children || null}
    </NavLink>
  );
}

CustomLink.propTypes = {
  children: PropTypes.object,
};

/**
 * Geneate the link for this example and any children
 * @param {object} example example with potential children
 * @return {object}
 */
function generateExampleLink(example) {
  const link = `/example/${example.id}/${example.name}`;
  return (
    <div className='toc-link'>
      <CustomLink
        key={example.id}
        to={link}
      >
        <div>
          {example.id} - {example.name}
        </div>
      </CustomLink>
      {(example.children || []).map(generateExampleLink)}
    </div>
  );
}

/**
 * Display a selectable TableOfContents
 * @param {object} props props for the object
 * @return {object}
 */
function TableOfContents(props) {
  const {examples} = props;

  return (
    <div className="tableOfContents">
      <CustomLink to="/" exact={true}>
        <div>
            Home
        </div>
      </CustomLink>
      {examples.map(generateExampleLink)}
    </div>
  );
}

TableOfContents.propTypes = {
  examples: PropTypes.array.isRequired,
};

export default TableOfContents;
