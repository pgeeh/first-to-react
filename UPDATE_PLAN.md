# Repo Update Plan

This document tracks the plan for modernizing `first-to-react`. It's a living
record — update it as phases land or the plan changes.

## Background

The site is a Create React App (react-scripts 4.0.0) tutorial app on React 17,
last touched in 2020/2021. Several dependencies are multiple majors behind,
and the build tool itself (CRA/react-scripts) is unmaintained.

Rather than upgrading the single app in place, the tutorial content itself
should become version-aware: the site will teach React 17, 18, and 19 side by
side, with visitors able to switch between them.

## Current state (audit notes)

- **Build tool**: `react-scripts` 4.0.0 (CRA) — unmaintained, no CRA 5 release.
- **React**: 17.0.1 / react-dom 17.0.1.
- **Routing**: `react-router-dom` 5.2.0 — v6/v7 changed the API (`Switch` →
  `Routes`, `useHistory` → `useNavigate`).
- **Styling**: Bootstrap 4.5.3 + `react-bootstrap` 1.4.0. Used in 5 files
  under `src`.
- **Dead dependency**: `@material-ui/core` and `@material-ui/icons` (v4) are
  listed in `package.json` but never imported anywhere in `src` — safe to
  remove outright.
- **Sass**: `node-sass` is aliased via npm (`"node-sass": "npm:sass@^1.29.0"`)
  to actually install `sass` — a legacy workaround that should just become a
  direct `sass` dependency.
- **Markdown**: `react-markdown` 4.3.1 (used in `Info.jsx`) — current major
  (v9+) is a full rewrite onto remark/rehype plugins and is ESM-only.
- **Code playground**: `react-live` 2.2.2 (used in `Editor.jsx`) — several
  majors behind current.
- **Image zoom**: `react-medium-image-zoom` 4.x (used in `Info.jsx`) — current
  major is v5.
- **Syntax highlighting**: `react-syntax-highlighter` 15.x (used in
  `Info.jsx`) — fairly current, low-risk bump.
- **Testing**: Testing Library versions from 2020, need bumping in step with
  whichever React version an app targets.
- **`web-vitals`**: 0.2.4 — v3+ renamed the API (`getCLS` → `onCLS`, etc.).
  Only used in `reportWebVitals.js`.
- **CI**: `.github/workflows/pages.yml` uses `actions/checkout@v2.3.1` and
  `JamesIves/github-pages-deploy-action@3.7.1` — both several majors behind.
  Deploys `build/` to the `docs` branch, which GitHub Pages serves from.
- **Tooling**: `eslint-config-google`, no `.nvmrc`/`engines` pin.
- **`generator-f-2-r`**: a Yeoman generator (separate `package.json`,
  unrelated dependency tree) used to scaffold new tutorial example pages via
  `yo f-2-r:example`, run from within a pages directory.

## Target architecture

GitHub Pages only serves static files, so three independently-built apps
under path prefixes, plus a small landing page, is the simplest way to offer
parallel per-version tutorial tracks — no runtime version-switching inside a
single bundle.

```
first-to-react/
  package.json          # npm workspaces root, orchestration scripts
  apps/
    v17/                 # today's app, moved here almost unchanged
    v18/                 # forked from v17, deps bumped to React 18
    v19/                 # forked from v17, deps bumped to React 19
  landing/                # small page linking to /v17 /v18 /v19
  generator-f-2-r/        # unchanged, run from within an app dir
  .github/workflows/pages.yml   # builds all 3 apps + landing, deploys as one tree
```

Deploy output on the `docs` branch mirrors that: `docs/index.html`
(landing), `docs/v17/…`, `docs/v18/…`, `docs/v19/…`. Each app sets its own
`homepage` (CRA) and router `basename` to its subpath.

## Phased plan

Each phase is a separate, independently reviewable/revertible PR.

0. **Safe vulnerability fixes (pre-restructure)** — run `npm audit fix`
   (non-force) on the current single-app tree, before any restructuring, so
   the baseline everything forks from is as clean as it can be without
   breaking changes. See [Phase 0 findings](#phase-0-findings) below.
0.5. **react-scripts 4 → 5 (still pre-restructure)** — bump the build tool
   itself, since it resolves the bulk of the remaining vulnerabilities and
   incidentally fixes the Node 17+ OpenSSL build crash. See
   [Phase 0.5 findings](#phase-05-findings) below.
1. **Repo restructure** — convert to an npm workspaces monorepo; `git mv` the
   current app into `apps/v17` with no functional changes; adjust
   `homepage`/CI paths so `master` stays deployable throughout. Pure
   plumbing, zero content risk.
2. **Remaining hygiene cleanup in `apps/v17`** — `@material-ui/core`/
   `@material-ui/icons` removal and the `node-sass` → `sass` swap already
   happened in Phase 0.5 (needed to unblock the react-scripts bump). What's
   left: bump CI action versions (`checkout`, `github-pages-deploy-action`),
   bump remaining low-risk libs (testing-library patch/minor,
   `react-medium-image-zoom`) within v17-compatible ranges, add
   `.nvmrc`/`engines`.
3. **Scaffold `apps/v19`** — fork v17 → v19, bump `react`/`react-dom` to 19
   (confirm `createRoot` usage), bump `react-router-dom`, testing-library,
   and everything else to React-19-compatible versions. Goal: identical
   content to v17, just building and passing tests on the new major — a
   parity baseline before any content diverges. Set `homepage`/basename to
   `/first-to-react/v19`.
4. **Scaffold `apps/v18`** — same recipe, targeting React 18, reusing what
   PR 3 established.
5. **Landing/selector page** — root entry page linking to `/v17`, `/v18`,
   `/v19`, plus a shared nav/header component so visitors can jump between
   versions from inside any app.
6. **CI/CD rewrite** — update `pages.yml` to build all three apps + landing
   and deploy the combined tree in one job.
7. **Content divergence (ongoing, multiple PRs)** — this is where v18/v19
   pages actually start teaching what's different: `createRoot`/automatic
   batching/`useTransition`/`useId` for 18; `use()`, Actions/
   `useActionState`, ref-as-prop, React Compiler mention for 19. Treated as
   topic-by-topic follow-up work rather than one PR, driven by editorial
   priorities rather than a fixed curriculum decided up front.

## Phase 0 findings

Ran `npm install --legacy-peer-deps` (required — `react-markdown@4.3.1`
declares a peer range of `^15.0.0 || ^16.0.0`, which npm's default strict
resolver rejects against the installed React 17) followed by
`npm audit fix --legacy-peer-deps` on the current tree.

- **225 → 160 vulnerabilities** (21 → 9 critical, 79 → 38 high, 118 → 104
  moderate, 7 → 9 low), with **zero `package.json` changes** — the fix only
  tightened transitive resolutions already permitted by existing semver
  ranges, recorded in `package-lock.json`.
- The remaining 160 all require breaking changes and split into two buckets:
  - **`react-scripts@5.0.1`** would resolve most of them (`sockjs`, `ws`,
    `uuid`, `websocket-driver`, `y18n`, `yaml`, `word-wrap`, `ua-parser-js`,
    `url-parse`, `node-tar`/`cacache`). These are all in the
    webpack-dev-server toolchain pulled in by `react-scripts` — dev-time
    exposure, not shipped in the production bundle, but still worth fixing.
  - **`react-markdown@10.1.0`** would resolve a `trim`/`remark-parse` ReDoS.
    This is the same breaking rewrite already noted above (remark/rehype
    plugin architecture, ESM-only) — not a small bump.
- **Build could not be verified in this sandbox on either the baseline or
  the audit-fixed tree**: Node 22 + webpack 4 (as shipped by
  `react-scripts@4.0.0`) hits `error:0308010C:digital envelope
  routines::unsupported` (the well-known OpenSSL 3 / webpack 4 MD4 hash
  incompatibility) on both trees identically, confirming it's pre-existing
  and unrelated to the audit fix. Working around it with
  `NODE_OPTIONS=--openssl-legacy-provider` gets further, but then the
  **audit-fixed tree hits a new failure**: a transitive Babel plugin got
  bumped past what `react-scripts`'s pinned `@babel/core@7.12.3` supports
  (`Requires Babel "^7.16.0", but was loaded with "7.12.3"`). The baseline
  tree fails at an earlier stage instead (a `postcss` ESM exports-map
  issue), so neither built cleanly enough here to fully confirm the
  audit-fixed tree is safe — it should be exercised on a Node version this
  toolchain actually supports (Node ≤16, or with the legacy-provider flag)
  before being trusted.
- GitHub's Actions API returned **zero recorded workflow runs** for this
  repo, so current CI health for `pages.yml` couldn't be confirmed from
  here. Given `pages.yml` doesn't pin a Node version via
  `actions/setup-node`, and modern `ubuntu-latest` runners ship Node
  versions well past 16, it's plausible the live deploy workflow is
  already hitting the same OpenSSL incompatibility. Worth confirming
  directly by watching the next real CI run.
- **Decision point**: the `react-markdown` vulnerability affects `apps/v17`
  too once it's forked out in Phase 1, since v17 is meant to stay
  behaviorally frozen. Bumping it is a breaking API rewrite, not a hygiene
  fix — needs an explicit call on whether v17 accepts that rewrite for the
  sake of the fix, or stays on the vulnerable version with the risk
  documented.

## Phase 0.5 findings

Bumped `react-scripts` `4.0.0` → `^5.0.1` (webpack 4 → 5) on the current
tree, since it's the single highest-leverage fix available pre-restructure.

- **225 → 34 vulnerabilities, 0 critical** (down from 21 critical at
  baseline, 9 after Phase 0). The remaining 34 are `react-markdown@4`'s
  `trim`/`remark-parse` ReDoS plus a handful of dev-only
  `webpack-dev-server`/`bfj` transitive issues that even `react-scripts@5`'s
  own dependency tree hasn't fully cleared yet — none shippable to
  production, none fixable without another breaking bump.
- Removed the dead `@material-ui/core`/`@material-ui/icons` dependencies
  (confirmed unused in `src`) and replaced the `node-sass` npm-alias hack
  with a direct `sass` dependency — both were already planned for Phase 2,
  pulled forward because `@material-ui/core`'s `react@^16.8.0` peer range
  was the exact conflict breaking CI in Phase 0's PR.
- **`react-markdown@4.3.1`'s peer conflict** (`react@"^15.0.0 || ^16.0.0"`
  against the installed React 17) no longer needs `--legacy-peer-deps`.
  Used a targeted `package.json` `overrides` entry instead
  (`"react-markdown": { "react": "$react" }`), which tells npm to satisfy
  just that one peer check with the root's resolved React version rather
  than loosening peer resolution tree-wide — avoids the collateral damage
  a blanket `--legacy-peer-deps`/`ajv` override caused below.
- **webpack 5 does fix the OpenSSL 3 crash** from Phase 0 — confirmed by a
  clean build on Node 22 in this sandbox with no flags and no Node-version
  pin needed. `pages.yml` no longer needs the Node 16 pin or
  `--legacy-peer-deps`; moved to Node 20.
- Hit two more webpack 5 breaking changes, both from `react-markdown@4`'s
  old `unified`/`vfile` dependency chain expecting Node core modules the
  bundler no longer auto-polyfills (`path`, then `process`). Rather than
  `npm run eject` (irreversible), added `react-app-rewired` — a thin,
  reversible wrapper — with a `config-overrides.js` supplying the two
  fallbacks via `resolve.fallback` + `webpack.ProvidePlugin`. `start`/
  `build`/`test` npm scripts now call `react-app-rewired` instead of
  `react-scripts` directly (`eject` still points at `react-scripts`, as
  `react-app-rewired` recommends).
- First attempt used a blanket `ajv`/`ajv-keywords` `overrides` to fix an
  unrelated `npm ls ajv` dedup conflict (`ajv-keywords@5` needs `ajv@^8`,
  but `eslint`'s `ajv@6` was getting hoisted over it) — that broke a
  *different* nested consumer (`fork-ts-checker-webpack-plugin`'s bundled
  `ajv-keywords@3.5.2`, built for the `ajv@6` keyword set) with `Unknown
  keyword formatMinimum`. Root cause was actually `--legacy-peer-deps`
  skewing npm's dedup; switching to the `react-markdown` override above
  and dropping `--legacy-peer-deps` entirely made the conflict disappear
  on its own, so the `ajv` override was removed.
- Also fixed two test-suite issues surfaced along the way (both
  pre-existing, unrelated to the version bump itself): `Info.jsx` imported
  `react-syntax-highlighter`'s ESM style file directly
  (`dist/esm/styles/prism`), which Jest can't transform by default —
  switched to the `dist/cjs/...` path. `App.test.js` was still the
  original CRA-boilerplate assertion (`getByText(/learn react/i)`), never
  updated when the actual tutorial content replaced the starter page —
  replaced with an assertion against real app content.
- Verified with a clean-room install (`rm -rf node_modules && npm install`,
  no flags) plus `npm run build` and `npm test`, both passing, and visually
  in a headless browser: the table of contents, a Main Concepts page's
  rendered markdown, syntax-highlighted code, and the `react-live`
  editor/preview pair all work correctly.
- `react-markdown` itself is still v4 (unfixed) — bumping to `v9`/`v10` is
  a full API rewrite (remark/rehype plugins, ESM-only) affecting `Info.jsx`
  directly, not just config. Left for a dedicated follow-up rather than
  folded into this pass.

## Status

| Phase | Status |
|---|---|
| 0. Safe vulnerability fixes | Done — lockfile-only, see findings above |
| 0.5. react-scripts 4 → 5 | Done — see findings above |
| 1. Repo restructure | Not started |
| 2. `apps/v17` remaining hygiene cleanup | Not started |
| 3. Scaffold `apps/v19` | Not started |
| 4. Scaffold `apps/v18` | Not started |
| 5. Landing/selector page | Not started |
| 6. CI/CD rewrite | Not started |
| 7. Content divergence | Not started |
