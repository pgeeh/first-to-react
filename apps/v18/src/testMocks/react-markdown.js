import React from 'react';

/**
 * Jest 27 (bundled with react-scripts@5) doesn't support the
 * package.json "exports" field, which react-markdown@10's ESM-only
 * remark/rehype/unified dependency tree relies on for its internal
 * subpath resolution (e.g. `unist-util-visit-parents/do-not-use-color`).
 * Tests don't need real markdown rendering, so stand in with a minimal
 * component and let the real thing be exercised in the browser.
 * @param {object} props props for the object
 * @return {object}
 */
export default function ReactMarkdown({children}) {
  return <div>{children}</div>;
}
