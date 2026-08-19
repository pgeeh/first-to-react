import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/first-to-react/v17/',
  plugins: [
    // This app's JSX-containing source files use a plain .js extension
    // (a CRA/babel-loader convention that auto-detected JSX regardless of
    // extension) rather than .jsx - widen the react plugin's default
    // .jsx/.tsx-only match so those still go through its JSX-aware
    // transform instead of failing in the plain-JS parser.
    react({include: '**/*.{js,jsx}'}),
  ],
  // Unlike apps/v18/apps/v19, this app doesn't need a react/react-dom
  // resolve.alias/dedupe: it's the only workspace member still on
  // react-bootstrap@^1.x, so npm nests no conflicting sibling copy for its
  // `uncontrollable` transitive dependency to accidentally resolve -
  // apps/v17 already resolves react/react-dom from the same
  // workspace-root-hoisted React 17 copy that `uncontrollable` itself
  // lives next to.
  //
  // Unique to this app: react-markdown@4's old unified@6/vfile dependency
  // chain (still CJS, pre-dating the remark/rehype ESM rewrite apps/v18
  // and apps/v19 already sit on) reaches for two things Vite - like
  // webpack 5 before it (see config-overrides.js's history in git blame /
  // the Phase 0.5 findings in UPDATE_PLAN.md) - doesn't auto-polyfill:
  // vfile/core.js does `require('path')` and reads `process.cwd()`
  // directly. `path` gets the same path-browserify swap the old webpack
  // fallback used. `process` can't get the same treatment: esbuild's
  // `define` only accepts literal/entity-name replacement values, not a
  // callable stand-in, so `process.cwd()` needs an actual `globalThis.process`
  // object to exist at runtime - `define` here just points the bare
  // `process` identifier at it, and src/index.jsx sets it eagerly (before
  // any markdown rendering can run) from the `process/browser` polyfill,
  // the same package the old webpack ProvidePlugin fallback used. (No
  // resolve.alias needed for `process` itself - index.jsx's own import
  // already resolves the package's real `process/browser` subpath fine.)
  resolve: {
    alias: {
      path: 'path-browserify',
    },
  },
  define: {
    process: 'globalThis.process',
  },
  // esbuild's own loader-by-extension only treats .jsx/.tsx as containing
  // JSX; plain .js is parsed as strict JS and rejects it. Vite's default
  // `exclude` for this transform is /\.js$/ (on the assumption .js is never
  // JSX) and take priority over `include` when both match, so it has to be
  // cleared explicitly too, not just widen `include`. The dep pre-bundler
  // is a separate esbuild pass and needs the same loader override
  // independently.
  esbuild: {
    loader: 'jsx',
    include: /\.[jt]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {'.js': 'jsx'},
    },
  },
  // .md and .jsexample files are fetched at runtime as raw text (see
  // readFile() in src/utils) rather than imported as JS modules or
  // components - treat them as static assets so importing one yields its
  // resolved URL, the same as an image import.
  assetsInclude: ['**/*.md', '**/*.jsexample'],
  build: {
    // Keep the CRA-era output directory name so pages.yml's existing
    // `apps/v17/build` reference (Phase 5-6) doesn't need to change.
    outDir: 'build',
    // Vite base64-inlines small assets by default. readFile() (src/utils)
    // does `fetch(url).then(r => r.text())` against .md/.jsexample import
    // URLs, and browser support for fetch() on data: URIs is inconsistent
    // - force those two extensions to always emit as real, fetchable
    // files regardless of size, while leaving normal image inlining alone.
    assetsInlineLimit: (filePath) =>
      /\.(md|jsexample)$/.test(filePath) ? false : undefined,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
});
