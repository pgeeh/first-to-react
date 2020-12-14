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
 * Geneate the link for this page and any children
 * @param {object} page page with potential children
 * @return {object}
 */
function PageLink(page) {
  const link = fullLinkPath(`/page/${page.id}/${page.name}`);
  return (
    <div key={page.id} className='toc-link'>
      <CustomLink
        to={link}
      >
        <div className="toc-link-text">
          {page.id} - {page.name}
        </div>
      </CustomLink>
      {(page.children || []).map(PageLink)}
    </div>
  );
}

/**
 * Display a selectable TableOfContents
 * @param {object} props props for the object
 * @return {object}
 */
function TableOfContents(props) {
  const {pages} = props;

  return (
    <div className="tableOfContents">
      <div className='toc-link'>
        <CustomLink key="home" to={fullLinkPath('/')} exact={true}>
          <div className="toc-link-text">
              Home
          </div>
        </CustomLink>
      </div>
      {pages.map(PageLink)}
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
  pages: PropTypes.array.isRequired,
};

export default TableOfContents;
