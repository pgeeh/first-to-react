import React, {useEffect, useMemo, useState} from 'react';
import {
  NavLink,
  useLocation,
} from 'react-router-dom';
import PropTypes from 'prop-types';

import {fullLinkPath} from '../../utils';

import './TableOfContents.scss';

const ACTIVE_ID_PATTERN = /\/page\/([^/]+)/;

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
 * Determine the ids of the ancestors of the provided id, so that they
 * can be expanded to reveal it.
 * @param {string} id dot-separated page id, e.g. "3.2.1"
 * @return {array} ancestor ids, e.g. ["3", "3.2"]
 */
function ancestorIds(id) {
  const parts = id.split('.');
  const ancestors = [];
  for (let i = 1; i < parts.length; i++) {
    ancestors.push(parts.slice(0, i).join('.'));
  }
  return ancestors;
}

/**
 * Render a page, and its children when expanded, as a collapsible node.
 * @param {object} props props for the object
 * @return {object}
 */
function PageNode({page, expandedIds, onToggle}) {
  const children = page.children || [];
  const hasChildren = children.length > 0;
  const isExpanded = expandedIds.has(page.id);
  const link = fullLinkPath(`/page/${page.id}/${page.name}`);

  return (
    <div className="toc-link">
      <div className="toc-link-row">
        {hasChildren ? (
          <button
            type="button"
            className="toc-toggle"
            onClick={() => onToggle(page.id)}
            aria-expanded={isExpanded}
            aria-label={
              (isExpanded ? 'Collapse ' : 'Expand ') + page.name
            }
          >
            {isExpanded ? '▾' : '▸'}
          </button>
        ) : (
          <span className="toc-toggle-spacer" />
        )}
        <CustomLink to={link}>
          <div className="toc-link-text">
            {page.id} - {page.name}
          </div>
        </CustomLink>
      </div>
      {hasChildren && isExpanded && (
        <div className="toc-children">
          {children.map((child) => (
            <PageNode
              key={child.id}
              page={child}
              expandedIds={expandedIds}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

PageNode.propTypes = {
  page: PropTypes.object.isRequired,
  expandedIds: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
};

/**
 * Display a selectable, collapsible TableOfContents. Sections containing
 * the active page are expanded automatically; other sections stay
 * collapsed until toggled.
 * @param {object} props props for the object
 * @return {object}
 */
function TableOfContents(props) {
  const {pages} = props;
  const location = useLocation();

  const activeId = useMemo(() => {
    const match = location.pathname.match(ACTIVE_ID_PATTERN);
    return match ? match[1] : null;
  }, [location.pathname]);

  const [expandedIds, setExpandedIds] = useState(
      () => new Set(activeId ? ancestorIds(activeId) : []),
  );

  // Whenever the active page changes, make sure its ancestors are
  // expanded, without collapsing anything the user already expanded.
  useEffect(() => {
    if (!activeId) {
      return;
    }
    setExpandedIds((prev) => {
      const next = new Set(prev);
      ancestorIds(activeId).forEach((id) => next.add(id));
      return next;
    });
  }, [activeId]);

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="tableOfContents">
      <div className='toc-link'>
        <div className="toc-link-row">
          <span className="toc-toggle-spacer" />
          <CustomLink key="home" to={fullLinkPath('/')} exact={true}>
            <div className="toc-link-text">
                Home
            </div>
          </CustomLink>
        </div>
      </div>
      {pages.map((page) => (
        <PageNode
          key={page.id}
          page={page}
          expandedIds={expandedIds}
          onToggle={toggleExpanded}
        />
      ))}
      <div className='toc-link'>
        <div className="toc-link-row">
          <span className="toc-toggle-spacer" />
          <CustomLink key="about" to={fullLinkPath('/about')} exact={true}>
            <div className="toc-link-text">
                About
            </div>
          </CustomLink>
        </div>
      </div>
    </div>
  );
}

TableOfContents.propTypes = {
  pages: PropTypes.array.isRequired,
};

export default TableOfContents;
