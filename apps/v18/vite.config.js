import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
import {createRequire} from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);

// Shared transitive dependencies (e.g. react-bootstrap's `uncontrollable`)
// dedupe to a single hoisted copy across the workspace whenever their
// semver range is loose enough to cover both apps/v18's React 18 and
// apps/v19's React 19, since npm only nests a second copy when ranges
// truly conflict. Those packages call React hooks internally and resolve
// `react`/`react-dom` from wherever *they* live, which can be the wrong
// major - force both to resolve to this app's own copies so there's only
// ever one React instance in the v18 tree. Same problem, same fix as the
// old config-overrides.js's webpack resolve.alias - it's a Node module
// resolution issue, not a bundler-specific one.
const reactAliases = {
  react: path.dirname(require.resolve('react/package.json')),
  'react-dom': path.dirname(require.resolve('react-dom/package.json')),
};

export default defineConfig({
  base: '/first-to-react/v18/',
  plugins: [
    // This app's JSX-containing source files use a plain .js extension
    // (a CRA/babel-loader convention that auto-detected JSX regardless of
    // extension) rather than .jsx - widen the react plugin's default
    // .jsx/.tsx-only match so those still go through its JSX-aware
    // transform instead of failing in the plain-JS parser.
    react({include: '**/*.{js,jsx}'}),
  ],
  resolve: {
    alias: reactAliases,
    // Belt-and-suspenders alongside the alias above, since dedupe forces
    // resolution from Vite's own root rather than by string substitution.
    dedupe: ['react', 'react-dom'],
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
    // `apps/v18/build` reference (Phase 6) doesn't need to change.
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
