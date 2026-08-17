const path = require('path');
const webpack = require('webpack');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// Shared transitive dependencies (e.g. react-bootstrap's `uncontrollable`)
// dedupe to a single hoisted copy across the workspace whenever their
// semver range is loose enough to cover both apps/v17's React 17 and
// apps/v19's React 19, since npm only nests a second copy when ranges
// truly conflict. Those packages call React hooks internally and resolve
// `react`/`react-dom` from wherever *they* live, which can be the wrong
// major - force both to resolve to this app's own copies so there's only
// ever one React instance in the v19 tree.
const reactAliases = {
  react: path.dirname(require.resolve('react/package.json')),
  'react-dom': path.dirname(require.resolve('react-dom/package.json')),
};

function overrideWebpack(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    path: require.resolve('path-browserify'),
    process: require.resolve('process/browser.js'),
  };
  config.resolve.alias = {
    ...config.resolve.alias,
    ...reactAliases,
  };

  // CRA's ModuleScopePlugin blocks imports that resolve outside src/,
  // but doesn't recognize the aliases above (absolute paths substituted
  // for a bare specifier) as pointing into node_modules - allowlist the
  // react/react-dom package directories explicitly.
  const moduleScopePlugin = (config.resolve.plugins || []).find(
      (plugin) => plugin.constructor.name === 'ModuleScopePlugin',
  );
  if (moduleScopePlugin) {
    moduleScopePlugin.allowedFiles.add(require.resolve('react/package.json'));
    moduleScopePlugin.allowedFiles.add(
        require.resolve('react-dom/package.json'),
    );
    moduleScopePlugin.allowedPaths = [...moduleScopePlugin.allowedFiles]
        .map((allowedFile) => path.dirname(allowedFile))
        .filter((p) => path.relative(p, process.cwd()) !== '');
  }

  config.plugins.push(
      new webpack.ProvidePlugin({
        process: 'process/browser.js',
      }),
  );

  // Bootstrap 5's SCSS inlines background-image SVGs as percent-encoded
  // data URIs. The css-minimizer-webpack-plugin CRA wires up by default
  // runs them through cssnano's bundled svgo, which chokes on that
  // encoding ("Non-whitespace before first tag") and emits a build
  // warning - harmless in dev, but `CI=true` (set automatically by
  // GitHub Actions) makes CRA treat any build warning as a hard failure.
  // Disabling just the svgo sub-optimization (not the whole minimizer)
  // avoids the warning while keeping the rest of cssnano's default CSS
  // minification.
  const cssMinimizer = (config.optimization.minimizer || []).find(
      (plugin) => plugin instanceof CssMinimizerPlugin,
  );
  if (cssMinimizer) {
    cssMinimizer.options.minimizer.options = {
      preset: ['default', {svgo: false}],
    };
  }

  return config;
}

// Jest 27 (bundled with react-scripts@5) resolves the "exports" map's
// "./dom" condition for react-router-dom's react-router dependency to a
// path it then can't locate, so point it at the resolved file directly.
function overrideJest(config) {
  // The "./dist/.../dom-export.js" path isn't itself listed in
  // react-router's "exports" map, so it can't be require.resolve()'d
  // directly - resolve the package directory (which is exported) instead
  // and join the known CJS build path onto it.
  const reactRouterDir =
    path.dirname(require.resolve('react-router/package.json'));

  config.moduleNameMapper = {
    ...config.moduleNameMapper,
    '^react$': reactAliases.react,
    '^react-dom$': reactAliases['react-dom'],
    '^react/(.*)$': `${reactAliases.react}/$1`,
    '^react-dom/(.*)$': `${reactAliases['react-dom']}/$1`,
    '^react-router/dom$':
      path.join(reactRouterDir, 'dist/development/dom-export.js'),
    // react-markdown@10's remark/rehype/unified dependency tree is
    // ESM-only and leans on package.json "exports" subpaths (e.g.
    // `unist-util-visit-parents/do-not-use-color`) that Jest 27 (bundled
    // with react-scripts@5) can't resolve at all. Stand in with a minimal
    // mock for tests; real markdown rendering is verified in the browser.
    '^react-markdown$':
      require.resolve('./src/testMocks/react-markdown.js'),
  };

  // react-medium-image-zoom@5 ships ESM-only, so Jest needs to transform
  // it too (CRA's default transformIgnorePatterns ignores all of
  // node_modules).
  config.transformIgnorePatterns = [
    '[/\\\\]node_modules[/\\\\](?!(react-medium-image-zoom)[/\\\\]).+\\.(js|jsx|mjs|cjs|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$',
  ];

  return config;
}

module.exports = {
  webpack: overrideWebpack,
  jest: overrideJest,
};
