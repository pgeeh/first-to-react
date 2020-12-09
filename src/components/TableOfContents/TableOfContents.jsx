import React from 'react';
import {
  NavLink,
} from 'react-router-dom';
import PropTypes from 'prop-types';

import {fullLinkPath} from '../../utils';

import './TableOfContents.scss';


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
function ExampleLink(example) {
  const link = fullLinkPath(`/example/${example.id}/${example.name}`);
  return (
    <div key={example.id} className='toc-link'>
      <CustomLink
        to={link}
      >
        <div className="toc-link-text">
          {example.id} - {example.name}
        </div>
      </CustomLink>
      {(example.children || []).map(ExampleLink)}
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
      <div className='toc-link'>
        <CustomLink key="home" to={fullLinkPath('/')} exact={true}>
          <div className="toc-link-text">
              Home
          </div>
        </CustomLink>
      </div>
      {examples.map(ExampleLink)}
      <div className='toc-link'>
        <CustomLink key="about" to={fullLinkPath('/about')} exact={true}>
          <div className="toc-link-text">
              About
          </div>
        </CustomLink>
      </div>
    </div>
  );
}

TableOfContents.propTypes = {
  examples: PropTypes.array.isRequired,
};

export default TableOfContents;
