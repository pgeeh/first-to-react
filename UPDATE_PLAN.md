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
8. **Migrate build tooling from CRA to Vite (multiple PRs)** — prompted by
   the Phase 7 round 3 content refresh, which updated `OtherLibraries.md` to
   recommend Vite over `create-react-app` (officially deprecated by the
   React team in 2025); the repo's own build tooling should practice what
   the tutorial content now preaches, and it would let the `react-app-rewired`/
   `config-overrides.js` workarounds accumulated since Phase 0.5 (Node-core
   polyfill fallbacks, the `postcss-svgo` CI-only build failure, the
   per-app React-version-isolation `resolve.alias`/`moduleNameMapper` hack)
   be dropped rather than carried forward indefinitely. Not a drop-in swap,
   so scoped as its own multi-PR phase rather than a quick follow-up:
   - **8a. Pilot on `apps/v19`** first, since it has no legacy CRA-specific
     history to preserve — swap `react-scripts`/`react-app-rewired` for
     Vite, replace Jest with Vitest (different test runner, so
     `setupTests.js` and `App.test.js` need rewriting, not just
     reconfiguring), re-implement the React-version-isolation trick as a
     native Vite `resolve.alias`, and re-verify the GitHub Pages
     `homepage`/basename/`404.html` SPA-redirect trick still works under
     Vite's dev server and build output shape (asset paths, `base` config).
   - **8b. Repeat for `apps/v17`/`apps/v18`** once the v19 pilot validates
     the pattern, reusing whatever Vite config the pilot establishes.
   - **8c. `pages.yml` update** — build commands change (`vite build`
     instead of `react-scripts`/`react-app-rewired build`); confirm the
     assembled `site/` deploy tree is unaffected.
   - Not yet started — no findings section below until 8a lands.
8.5. **Drop npm workspaces** — give each app a fully independent install
   (own `node_modules`, own `package-lock.json`), rather than the shared
   root-hoisted `node_modules` the Phase 1 restructure set up. Landed in
   parallel with, and had to be reconciled against, Phase 8b/8c's
   hoisting-determinism fixes — see findings below.
9. **Share common code across `apps/v17`/`v18`/`v19`** — prompted by today's
   `TableOfContents` bugfix session: its `.jsx`/`.scss` pair turned out to be
   byte-identical (modulo the `react-router` v5-vs-v6/v7 API surface) across
   all three apps, so three real layout bugs (a stray `:hover { width:
   fit-content }` rule, a flex `min-width: auto` overflow, and an `em`-vs-
   `rem` toggle/spacer misalignment) each had to be found and fixed three
   times by hand. Likely more of `src/components` and `src/scss` is
   similarly duplicated rather than intentionally diverged content — worth
   an audit, not just this one component. Note this cuts against the
   direction just taken elsewhere in the tree: apps were deliberately moved
   *off* a shared `node_modules` (dropped npm workspaces entirely) because
   hoisting silently mixed incompatible dependency versions across apps
   pinned to different React majors — any code-sharing mechanism here needs
   to avoid reintroducing that failure mode (e.g. a real shared package each
   app depends on explicitly, rather than a build step relying on hoisting
   or a symlink/copy step that can drift silently). Solution not decided yet
   — scoped as an investigation phase, findings/approach to be recorded once
   it's actually worked.
   - Not yet started — no findings section below until this phase lands.

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

## Phase 1 findings

`git mv`'d the app (`package.json`, `package-lock.json`, `config-overrides.js`,
`.eslintrc.json`, `public/`, `src/`) into `apps/v17/`, unchanged in content.
Added a new root `package.json` declaring `"workspaces": ["apps/*"]` plus
`build:v17`/`start:v17`/`test:v17` orchestration scripts that call
`--workspace=apps/v17` — a pattern later phases repeat for `apps/v18`/`v19`.
`generator-f-2-r/` stays outside `apps/*`, as planned — it's an unrelated
Yeoman dependency tree, not an npm workspace member.

- **`homepage` left as `/first-to-react`** (not `/first-to-react/v17`) —
  changing it now would move the deployed asset/base paths before the
  landing page and multi-app CI (Phases 5–6) exist to route `/v17` traffic
  anywhere, breaking the live site for no reason. Revisit when the landing
  page ships.
- **`apps/v17/package.json`'s `name` renamed** `first-to-react` →
  `first-to-react-v17`, since the root `package.json` now also owns the bare
  `first-to-react` name and workspace package names should be unique/
  descriptive — same naming pattern `v18`/`v19` will follow.
- **`overrides` moved from `apps/v17/package.json` to the root
  `package.json`**, and its value changed from the `$react` self-reference to
  a literal `^17.0.1` — npm only reads `overrides` from the workspace root,
  and `$react` resolves against a `dependencies.react` entry the (dependency-
  free) root package.json doesn't have. `npm install` failed with the
  original peer-conflict ERESOLVE error until this moved; a literal range
  works from the root without needing a dummy root-level `react` dependency.
- **`.gitignore` patterns un-anchored**: `/coverage` → `coverage`, `/build` →
  `build` (and the redundant `/node_modules` + `**node_modules` pair
  collapsed to just `node_modules`) so they match at any depth — the old
  leading-`/` patterns only matched the repo root and would have left
  `apps/v17/build`/`apps/v17/coverage` untracked-but-visible to git status.
- **CI** (`pages.yml`): install step is unchanged (`npm install` at the repo
  root installs all workspaces); build step now calls `npm run build:v17`;
  deploy step's `FOLDER` now points at `apps/v17/build` instead of `build`.
- Verified with a clean-room install (`rm -rf node_modules apps/v17/node_modules
  && npm install`, no flags), `npm run build:v17`, and `npm run test:v17`
  from the repo root — all pass, output lands at `apps/v17/build/` as
  expected, single test suite still green.

## Phase 2 findings

Covered the items left over from Phase 0.5/1's pulled-forward hygiene work:
CI action versions, low-risk lib bumps, and a Node version pin.

- **CI actions bumped**: `actions/checkout` `v2.3.1` → `v7`, `JamesIves/
  github-pages-deploy-action` `3.7.1` → `v4`. The deploy action's v4 renamed
  all its inputs to lowercase (`GITHUB_TOKEN`/`BRANCH`/`FOLDER`/`CLEAN` →
  `token`/`branch`/`folder`/`clean`) and now expects the workflow to grant
  `contents: write` itself rather than assuming it — added a top-level
  `permissions: contents: write` block to `pages.yml`, without which the
  push to the `docs` branch would likely fail under GitHub's now-default
  read-only `GITHUB_TOKEN` permissions. Also bumped `actions/setup-node`
  `v4` → `v7` even though the original audit didn't flag it — it's gone
  equally stale since, and this file was already open for the same reason.
- **Low-risk lib bumps, kept within their existing majors** (per the plan's
  "patch/minor" wording, to avoid pulling in breaking API changes on a
  frozen-content v17 app): `@testing-library/jest-dom` `^5.11.6` →
  `^5.17.0` (last 5.x — v6+ drops the `/extend-expect` subpath
  `setupTests.js` imports), `@testing-library/react` `^11.2.2` → `^11.2.7`
  (last 11.x — v12 is the last major supporting React <18, saved for if a
  future v17-track bump is worth a separate call), `@testing-library/
  user-event` `^12.2.2` → `^12.8.3` (unused in `src`, safe regardless).
  `react-medium-image-zoom` went further, `^4.3.1` → `^4.4.3` (latest 4.x,
  peer range explicitly covers React 17; v5 is the ESM/breaking rewrite
  noted in the original audit and stays out of scope here).
- **Added `.nvmrc`** (`20`, matching `pages.yml`'s `node-version: 20`) and
  an `"engines": { "node": ">=20" }` field on the root `package.json`.
- **Deleted `apps/v17/package-lock.json`**: npm workspaces only read/write
  the root lockfile — this per-app copy was a leftover from the Phase 1
  `git mv` that Phase 1's own install had happened to leave in sync, but
  this phase's dependency bumps updated only the root lockfile and left it
  silently stale (still pinned `react-medium-image-zoom@^4.3.1`). Kept
  around, it would mislead anyone running `npm ci` from inside `apps/v17`
  directly. The root `package-lock.json` is the only one that matters now.
- **Verified visually**: ran the dev server and drove it with Playwright/
  Chromium — `react-medium-image-zoom` v4.4.3's zoom-button overlay
  (`data-rmiz-btn-open`) rendered and opened correctly on a page with an
  embedded diagram, confirming no regression from the version bump. The
  only console output was a pre-existing `validateDOMNesting` warning from
  `react-markdown` wrapping an `<img>` in a `<div>` inside a `<p>` —
  unrelated to this phase's changes, present before and after.
- Re-verified with a clean-room install + `npm run build:v17` +
  `npm run test:v17` after the lockfile deletion — all still pass.

## Phase 3 findings

`cp`'d `apps/v17` to `apps/v19` (no shared git history — a fresh copy, same as
a fork) and bumped every React-coupled dependency to a version whose peer
range covers React 19, keeping content identical. `homepage` and the
`PATH_ROOT` constant (`src/constants/index.js`) both moved to
`/first-to-react/v19`. Root `package.json` gained `start:v19`/`build:v19`/
`test:v19` scripts; `pages.yml` is untouched (still only builds/deploys
v17 — that's Phase 6).

- **`react`/`react-dom` `^17.0.1` → `^19.0.0`**: `src/index.js`'s
  `ReactDOM.render` was replaced with `createRoot(...).render(...)` —
  `ReactDOM.render` was removed outright in React 19, not just deprecated.
- **`react-router-dom` `^5.2.0` → `^7.18.2`**: v6 replaced `Switch` with
  `Routes` and dropped the children-as-route-content pattern in favor of an
  `element` prop, so `App.js`'s three routes were rewritten accordingly.
  `NavLink`'s `activeClassName` prop was removed in favor of a
  `className={({isActive}) => ...}` function
  (`components/TableOfContents/TableOfContents.jsx`), and the `exact` prop
  was replaced with `end` for the two top-level nav links. Separately, v6+
  routes match exactly by default (v5 matched any URL with the route's path
  as a *prefix* unless `exact` was set) — the page route's links are
  `/page/<id>/<name>` (two segments) against a route declared as
  `/page/:activeId` (one param), which silently stopped matching after the
  bump. Fixed by adding a trailing `/*` to the route path
  (`/page/:activeId/*`) to restore the old prefix-matching behavior; caught
  only by clicking through the live app, not by the build or the test
  suite — worth remembering for the `v18` scaffold too.
- **`react-markdown` `^4.3.1` → `^10.1.0`**: the whole library was rewritten
  onto remark/rehype/unified since v4. `Info.jsx` now passes markdown as
  `children` instead of a `source` prop, and `components` instead of
  `renderers`; the map is keyed by rendered HTML tag name (`code`/`img`) now
  rather than markdown node type (`code`/`image`). The old dedicated
  code-block renderer had no inline-code counterpart to worry about (v4
  only called it for fenced blocks); v10 calls the same `code` component for
  both, distinguished by checking for a `language-*` class name and falling
  back to a plain `<code>` for inline spans. v10 also stopped wrapping
  output in a container element, so the `className="info"` styling hook
  moved onto a manually-added wrapping `<div>`.
- **`react-live` `^2.2.2` → `^4.1.8`**: `LiveProvider`/`LiveEditor`/
  `LiveError`/`LivePreview` and their props (`code`, `noInline`, `scope`,
  `transformCode`, `theme`) are unchanged. Its `prism-react-renderer`
  dependency jumped 1.x → 2.x, which dropped the per-theme subpath exports
  (`prism-react-renderer/themes/vsDark`) for a single `themes` named export
  (`themes.vsDark`) — `Editor.jsx` updated accordingly, and
  `prism-react-renderer` was added as an explicit `apps/v19` dependency
  since it's imported directly rather than only used transitively.
- **`react-medium-image-zoom` `^4.4.3` → `^5.4.9`**: v5's peer range is the
  first to explicitly cover React 19 (v4's tops out at 18). It's an
  ESM-only rewrite, but the public API (default-exported `Zoom` wrapping an
  `<img>`) is unchanged, so no source changes were needed beyond the
  version bump and a Jest transform tweak (below).
- **`@testing-library/react` `^11.2.7` → `^16.3.2`**, **`jest-dom` `^5.17.0`
  → `^7.0.1`** (dropped the `/extend-expect` subpath — `setupTests.js` now
  imports the package root directly, which auto-extends `expect` since
  v6), **`user-event` `^12.8.3` → `^14.6.4`** (unused in `src`, safe
  regardless).
- **`react-bootstrap` `^1.4.0` → `^2.10.10`, `bootstrap` `^4.5.3` →
  `^5.3.8`**: not React-19-driven on paper (v1's peer range is an open
  `>=16.8.0`), but two real problems forced it. First, `apps/v17` and
  `apps/v19` both wanting `react-bootstrap@^1.x` would have deduped to one
  hoisted copy at the workspace root; that copy's own dependency on
  `uncontrollable` (a hooks-based library, not a React peer dep) resolves
  `react` from wherever *it* physically lives, which — being hoisted to the
  root alongside v17's React 17 — silently broke v19 with "Invalid hook
  call" (two React copies in one render tree). Bumping v19 to a distinct
  major forces npm to nest a separate copy that resolves its own nested
  React 19. Second, react-bootstrap v1 still falls back to
  `ReactDOM.findDOMNode` in one code path (`safeFindDOMNode.js`), which
  React 19 removed outright; v2 keeps the same fallback but only exercises
  it for class-component refs, which this app doesn't use either way — v2
  was the lower-risk choice regardless. No Bootstrap-4-only utility classes
  (`ml-`/`mr-`/`badge-`/`.close`/`data-toggle`/etc.) were in use, so the
  Bootstrap 5 CSS bump carried no visible content risk; confirmed visually
  below.
- **`config-overrides.js` additions**, all `apps/v19`-only:
  - The existing `process`/`path` webpack fallback moved from
    `process/browser` to the fully-specified `process/browser.js` —
    react-router's package is `"type": "module"`, and strict ESM resolution
    (unlike CJS) requires extensions on relative-style specifiers.
  - `resolve.alias` forces `react`/`react-dom` to this app's own installed
    copies, and `ModuleScopePlugin`'s `allowedFiles`/`allowedPaths` are
    extended to allow-list them — CRA's default "no imports outside src/"
    guard doesn't recognize an alias's absolute path as pointing into
    `node_modules`, otherwise the build fails. This is the general fix for
    the `uncontrollable` problem above: it guarantees a single React
    instance in the v19 bundle regardless of what else gets hoisted.
  - A `jest` override (react-app-rewired supports exporting
    `{webpack, jest}` instead of a single function) adds: the same
    `react`/`react-dom` aliasing via `moduleNameMapper`, for the same
    reason, in the test environment; a `moduleNameMapper` entry resolving
    `react-router/dom` to its concrete CJS build file, because Jest 27
    (bundled with `react-scripts@5`) doesn't support the package.json
    `exports` field at all and fails to resolve that subpath on its own; a
    `transformIgnorePatterns` override letting Jest transform
    `react-medium-image-zoom`'s ESM output; and a `moduleNameMapper` entry
    mocking `react-markdown` entirely for tests
    (`src/testMocks/react-markdown.js`) rather than trying to get Jest 27 to
    transform its whole remark/rehype/unified dependency tree — that tree
    leans on `exports` subpaths too (e.g.
    `unist-util-visit-parents/do-not-use-color`), so the same Jest
    limitation would keep resurfacing package by package. Real markdown
    rendering is exercised in the browser instead (below), matching how
    react-live's rendering is already untested by the Jest suite.
  - `setupTests.js` also polyfills `TextEncoder`/`TextDecoder` from Node's
    `util` module onto `global` — `jest-environment-jsdom` doesn't provide
    them, but react-router depends on them being present at import time.
- **Root `package.json` `overrides`**: the existing `react-markdown` →
  `react` peer override (needed for v17's react-markdown@4 against React
  17) was rescoped to key specifically off `"4.3.1"` rather than the bare
  package name, since v19's react-markdown@10 already declares `react: '>=
  18'` and applying the same override to it would have forced the wrong
  peer value.
- **Verified**: clean-room install (`rm -rf node_modules apps/*/node_modules
  && npm install`) plus `npm run build:v17`/`test:v17` and
  `build:v19`/`test:v19` all pass — v17 unaffected throughout. Verified
  visually with the dev server driven by Playwright/Chromium on both apps
  side by side: home page, the JSX page's syntax-highlighted code blocks,
  and all three live editor/preview pairs render and work in v19, with
  active-nav-link highlighting and routing behaving the same as v17. The
  only console output on either app was two pre-existing, content-level
  warnings present identically on both — the same `<img>`-in-`<div>`-in-`<p>`
  nesting warning noted in the Phase 2 findings, and a missing-`key`-prop
  warning from the "No JSX" example's own source — confirming they predate
  this phase rather than being introduced by it.

## Phase 4 findings

`cp`'d `apps/v19` to `apps/v18` (fresh copy, no shared git history) and lowered
just `react`/`react-dom` to `^18.3.1`. Every other React-coupled dependency
Phase 3 bumped for v19 — `react-router-dom@^7`, `react-live@^4`,
`react-markdown@^10`, `react-medium-image-zoom@^5`, `react-bootstrap@^2`,
`@testing-library/react@^16`, `jest-dom@^7` — already declares a peer range
covering React 18 as well as 19 (checked each with `npm view <pkg> peerDependencies`
before starting), so no source or dependency-version changes beyond that were
needed: `apps/v19`'s router/markdown/live-editor rewrites and
`config-overrides.js` (React-version-generic — it aliases whatever
`react`/`react-dom` are actually installed in the app) carried over unchanged.

- **`package.json`**: `name` → `first-to-react-v18`, `homepage` →
  `/first-to-react/v18`, `react`/`react-dom` → `^18.3.1` (latest 18.x).
- **`src/constants/index.js`**: `PATH_ROOT` → `/first-to-react/v18`.
- **`config-overrides.js`**: comments referencing "v19"/"React 19" reworded to
  "v18"/"React 18" — the aliasing logic itself needed no change.
- Root `package.json` gained `start:v18`/`build:v18`/`test:v18` scripts,
  following the same `--workspace=apps/v18` pattern as v17/v19. No change
  needed to the `react-markdown` `overrides` entry — it's keyed to v17's
  pinned `4.3.1`, and v18 uses the same `react-markdown@^10.1.0` as v19.
- **Confirmed a single nested React copy**: after a clean-room `npm install`,
  `apps/v18/node_modules/react` and `apps/v18/node_modules/react-dom` are
  present as their own nested copies (18.3.1), distinct from the root-hoisted
  17.0.2 and `apps/v19`'s own nested 19.x copy — same dedup behavior Phase 3
  engineered `config-overrides.js`'s `resolve.alias`/`moduleNameMapper`
  around, working identically for a third major.
- **Verified**: clean-room install (`rm -rf node_modules apps/*/node_modules
  package-lock.json && npm install`) plus `npm run build:v17`/`test:v17`,
  `build:v18`/`test:v18`, and `build:v19`/`test:v19` all pass — v17/v19
  unaffected. (`CI=true` makes CRA treat warnings as build errors and fails
  all three apps identically on a pre-existing Bootstrap 5 `postcss-svgo`
  warning unrelated to this phase — building without it, as the actual
  `pages.yml` deploy does, succeeds.) Verified visually with the dev server
  driven by Playwright/Chromium: home page renders with nav and
  active-link highlighting, and the JSX page's syntax-highlighted code
  blocks and live editor/preview pair render and work. The only console
  output was the same two pre-existing, content-level warnings noted in the
  Phase 2/3 findings (the `<img>`-in-`<div>`-in-`<p>` markdown nesting
  warning and the missing-`key`-prop warning from the "No JSX" example),
  confirming no regression introduced by this phase.

## Phase 5 findings

Added a `landing/` root entry page and moved `apps/v17` off the site root
onto `/v17`, so the deployed tree becomes `docs/index.html` (landing),
`docs/v17/…`. **By explicit request, only v17 is linked from the landing
page and only v17 is built/deployed by CI — v18/v19 stay unbuilt in
`pages.yml` and unlinked from the landing page** until their tracks are
ready to show, even though both already scaffold and build correctly
(Phases 3–4). This is a deliberate narrowing of the plan's original Phase 5
scope ("linking to `/v17`, `/v18`, `/v19`"), not an oversight.

- **`landing/`**: a small static page (plain HTML/CSS, no build step —
  a single page with one live link doesn't need a 4th CRA app/workspace
  member). Lists version tracks as cards; only a `React 17` card linking to
  `v17/` is present right now, plus a one-line note that the 18/19 tracks
  are on the way. Adding them later is just appending another `.version-card`
  once Phase 6 wires their CI build/deploy — deliberately not built as a
  data-driven list with a `hidden`/`available` flag for two entries that
  don't exist in the rendered page yet. Reuses the site's existing
  `f2r-logo.png`/favicon assets and the purple (`rgb(66, 7, 91)`) accent
  color from `apps/*/src/scss/_colors.scss`.
- **`apps/v17` homepage/basename move** (`/first-to-react` →
  `/first-to-react/v17`, in both `package.json`'s `homepage` and
  `src/constants/index.js`'s `PATH_ROOT`) — the change Phase 1 explicitly
  deferred "until the landing page ships." No routing-logic changes needed:
  v17 already prefixes every route/link through `fullLinkPath(PATH_ROOT)`
  rather than a router `basename`, the same pattern Phase 3 proved out for
  v19's own subpath.
- **Fixed a latent bug surfaced by the move**: several `.md` files
  (`Home.md`'s logo, and five diagram images across `MainConcepts`/
  `BuildingonReact`/`WhatisReact`) hardcode absolute image paths
  (`/first-to-react/f2r-logo.png` etc.) rather than going through
  `fullLinkPath`, since markdown source can't call a JS helper. These
  silently pointed at the old root path in **all three apps**, v18/v19
  included — harmless only because neither had been deployed anywhere yet.
  Rewrote all three apps' copies to their own already-correct prefix
  (`/first-to-react/v17/…`, `/v18/…`, `/v19/…`).
- **Fixed a second latent bug in the GitHub-Pages SPA-redirect trick**:
  `public/404.html`'s `pathSegmentsToKeep` was `1` in all three apps
  (correct only when an app is hosted at the repo root, one path segment
  deep). Now that every app lives two segments deep
  (`/first-to-react/vNN/…`), a direct/refreshed load of an inner route
  (e.g. `/first-to-react/v17/page/3.1`) would 404 and the redirect script
  would then strip the `vNN` segment along with the route, landing back at
  the app root instead of the intended page. Bumped to `2` in all three
  apps' `404.html`. Verified by serving a local GitHub-Pages-shaped
  directory tree (`/first-to-react/…` prefix, with a handler standing in
  for GitHub's per-directory 404 fallback) and loading
  `/first-to-react/v17/page/3.1` directly with Playwright: the JSX page
  rendered correctly, deep-link intact, rather than bouncing to the home
  page.
- **`apps/v17/src/App.js`**: added an "All Versions" link (top-right of the
  navbar, via a new `Nav`/`Nav.Link`) back to the landing page — a plain
  `href="/first-to-react/"`, not a `fullLinkPath` route, since it leaves
  this app entirely. This is the "shared nav" piece of the original Phase 5
  wording, scoped down to what's useful with only one version live: a way
  back to the selector, not an in-app dropdown of tracks that don't exist
  yet. `apps/v18`/`v19` don't get this link yet — nothing points at them to
  link back from.
- **`pages.yml`**: build step is unchanged (`npm run build:v17` only, v18/v19
  still not built by CI). Added an "Assemble deploy tree" step that copies
  `landing/` verbatim into `site/` and `apps/v17/build` into `site/v17`, then
  pointed the deploy action's `folder` at `site` instead of `apps/v17/build`
  directly. This is Phase 6 work pulled forward the same way Phase 0.5
  pulled forward Phase 2 material — needed here because changing v17's
  `homepage` without also updating what CI deploys and where would break the
  live site. v18/v19's own build/deploy steps are left for when their
  tracks actually get linked from the landing page.
- **Verified**: clean-room install plus `build:v17`/`test:v17` and
  `build:v18`/`test:v18`, `build:v19`/`test:v19` all pass (the markdown/
  404.html edits touch v18/v19 too, so re-verified those builds stayed
  green). Locally assembled the exact tree `pages.yml` now produces
  (`landing/` + `apps/v17/build` under a `site/` root) and served it with a
  path prefix simulating the real `github.io/first-to-react/…` deploy
  shape. Verified with Playwright: the landing page renders and its React
  17 card links to `/first-to-react/v17/`; from inside v17, "All Versions"
  correctly returns to the landing page; a direct load of a deep in-app URL
  (`/first-to-react/v17/page/3.1`) round-trips through the 404.html
  redirect trick and renders the right page rather than 404ing or landing
  on the wrong route.

## Phase 6 findings

Extended `pages.yml` to build and deploy `apps/v18`/`apps/v19` alongside
`apps/v17`, closing out the build/deploy gap Phase 5 deliberately left open.

- **Build step** now runs `build:v17`, `build:v18`, and `build:v19` in
  sequence (all three already had working, independently-verified build
  scripts since Phases 3–4 — this just wires them into CI).
- **Assemble deploy tree step** now copies all three apps' `build/` output
  into `site/v17`, `site/v18`, `site/v19` alongside the landing page at the
  tree root, so all three tracks are live and reachable by direct URL
  (`/first-to-react/v18/`, `/first-to-react/v19/`) once deployed.
- **By explicit request, `landing/index.html` is unchanged** — only the
  React 17 card is present, and the "in progress" note about 18/19 stays as
  written. v18/v19 are built and deployed, but not linked from anywhere in
  the site, so they aren't discoverable by a visitor browsing normally —
  "activating" them (adding their landing-page cards) is intentionally left
  for a later, separate change.
- **Verified**: clean-room install (`rm -rf node_modules apps/*/node_modules
  && npm install`, no flags) plus `build:v17`/`test:v17`, `build:v18`/
  `test:v18`, `build:v19`/`test:v19` all pass. Locally reproduced the exact
  "Assemble deploy tree" step CI now runs and confirmed the resulting `site/`
  tree has `index.html` plus `v17/`, `v18/`, `v19/` subdirectories each with
  a complete, independent build.

## Phase 7 findings (pilot: Hooks section)

Started content divergence with a single pilot section - the `OtherConcepts/Hooks`
page - rather than sweeping all 42 pages at once, to validate the pattern
before it's repeated elsewhere. Before this, `apps/v18`/`apps/v19` content
was byte-for-byte identical to `apps/v17` (only image path prefixes
differed) - nothing had actually taught what's different about React 18/19
yet.

- **`apps/v18` gained two new Hook pages**: `useTransition` (a filtered-list
  example showing `isPending`/`startTransition` keeping a text input
  responsive while a large list re-filters) and `useId` (a reusable
  `LabeledInput` component showing stable, collision-free IDs across
  multiple instances). `Hooks.md` gained bullet entries for both plus a
  paragraph on React 18's automatic batching, which underpins why
  transitions are cheap to use. `Hooks/index.js`'s `children` array wired
  both in, following the existing per-hook-folder pattern (`.md` + one or
  more `.jsexample` files + `index.js` config).
- **`apps/v19` gained two new Hook pages**: `use` (two examples - reading a
  cached `fetch` Promise under `<Suspense>`, and reading Context
  conditionally, something `useContext` cannot do) and `useActionState` (a
  form with an `async` Action simulating a server update, showing
  `isPending` and returned error state). `Hooks.md` and `Hooks/index.js`
  updated the same way as v18.
- **`use`'s Promise example needed hardening**: the first draft let a failed
  `fetch` leave `use()`'s Promise rejected, which reaches for the nearest
  error boundary - a concept this tutorial doesn't teach anywhere else, and
  react-live's own internal error boundary doesn't render a fallback UI, so
  a failed request silently went blank. Changed `fetchUser` to `.catch()`
  the failure into a resolved `{error}` value instead, so the example is
  self-contained and a real network hiccup renders a message rather than an
  empty preview.
- **Verified with a clean-room install** plus `build:v18`/`test:v18` and
  `build:v19`/`test:v19` (still passing). Ran both dev servers and drove
  them with Playwright/Chromium: `useTransition`'s filter input stayed
  responsive and showed the pending indicator while typing into a
  20,000-item list; `useId` rendered two distinct, stable IDs correctly
  linking each label to its input; `use`'s Conditional Context example
  toggled correctly; `useActionState`'s form submitted, showed a pending
  state, and updated the rendered name. `use`'s Promise example itself
  could not be fully exercised end-to-end here - this sandbox's outbound
  network blocks `jsonplaceholder.typicode.com` (confirmed the *pre-existing*
  `useEffect` "Fetch" example, unrelated to this change, hits the same
  block) - but the failure path was verified instead, rendering the
  expected error message rather than going blank. Both dev servers logged
  no console errors from the new pages.
- **Scope note for continuing this phase**: this pilot only touched the
  `Hooks` page. Per the original plan wording, still open: `createRoot`
  content (arguably belongs on a rendering/entry-point page rather than
  Hooks), `ref-as-prop` (touches `ComponentsandProps`/`FunctionalComponents`
  for v19), and a React Compiler mention (v19, likely on `WhatisReact` or a
  new `BuildingonReact` entry) - each is its own follow-up in the same
  per-topic style as this pilot, not a fixed checklist to clear in one PR.

## Phase 7 findings (round 2: createRoot, ref-as-prop, React Compiler)

Closed out the three items the pilot round left open, each landing where the
existing content structure fit best rather than forcing a single new page.

- **`createRoot` / mounting** (`WhatisReact.md`, v18 and v19): added a
  "Mounting the App" subsection under the existing "Basics" section, since
  that page already references "the initial entry point" without explaining
  it. v18's version frames `createRoot` as a same-behavior API replacing
  `ReactDOM.render`, tying it back to the automatic batching note already on
  the Hooks page. v19's version additionally notes `ReactDOM.render` was
  removed outright in React 19 (not just deprecated, as it still was in
  React 18) - readers coming straight from v17 hit this as a hard break, not
  a soft one. Both use a fenced ` ```jsx ` code block - the first time any
  page in the tutorial has used one inline in markdown rather than a
  separate live `.jsexample` - confirmed it renders through the same
  syntax-highlighted `CodeRenderer` the Editor uses, since mounting code
  isn't something that belongs in an editable live sandbox.
- **`ref-as-prop`** (new `OtherConcepts/Refs` page, v18 and v19): refs
  weren't taught anywhere in the existing content (only used incidentally
  inside one `useEffect` example), so this added the general concept -
  `useRef`, attaching a `ref` to a DOM element - as the shared half, then
  diverged on the actual prop-passing mechanics. v18's __Forwarded Ref__
  example shows the `React.forwardRef` wrapper still required to pass a ref
  into a function component. v19's __Ref as Prop__ example shows the same
  result read straight out of `props.ref`, no `forwardRef` needed, with the
  `.md` noting `forwardRef` still works in React 19 but is expected to be
  removed in a future major. Wired into `OtherConcepts/index.js` alongside
  `Fragments`/`Hooks` on both apps, with a one-line `OtherConcepts.md`
  mention.
- **React Compiler mention** (v19 only): rather than inventing a new page,
  discovered `BuildingonReact/PerformanceandUsability` already existed as a
  page in all three apps but was commented out of every `BuildingonReact/
  index.js` and its `.md` only ever said "Default information" - a dead
  stub since Phase 1, never reachable through navigation. Wrote real content
  for v19's copy (what the React Compiler automates, that it's a build-time
  plugin rather than a runtime API, and that it still depends on code
  following the Rules of React already taught throughout the tutorial), then
  uncommented it in `apps/v19/src/pages/BuildingonReact/index.js` only -
  v17/v18 stay as the disabled stub, unchanged. Its placeholder
  `.jsexample` (which referenced an undefined `test` variable - a
  pre-existing bug, moot while unreachable) was deleted along with the
  `examples` key in `index.js`, since a build-time compiler isn't something
  a live code sandbox can demonstrate; it follows the `OtherLibraries`
  page's existing info-only pattern instead.
- **Verified with a clean-room install** (including a full `package-lock.json`
  regeneration, not just `node_modules`) plus `build:v17`/`test:v17`,
  `build:v18`/`test:v18`, `build:v19`/`test:v19`, all passing. Drove both
  dev servers with Playwright/Chromium: confirmed v18 and v19's "What is
  React?" page renders the new mounting section (and the code block's
  syntax highlighting) correctly; clicked through both Refs pages'
  examples and confirmed `document.activeElement` actually moved to the
  right `<input>` in all four cases (plain `useRef`, `forwardRef`, and
  ref-as-prop); confirmed v19's Performance and Usability page now shows
  the React Compiler content at nav position 5.3 instead of 404ing or
  showing the old stub. No new console errors beyond the same pre-existing
  markdown image-nesting warning already documented in earlier phases.

## PR #16 CI build failure (v18/v19 `postcss-svgo`)

Phase 6's PR failed in CI on `build:v18` with `Failed to compile` /
`postcss-svgo:: Non-whitespace before first tag.`, tracing to the
percent-encoded SVG data URIs Bootstrap 5's SCSS inlines for background
images - a pre-existing, already-documented warning (Phase 4 findings: "a
pre-existing Bootstrap 5 `postcss-svgo` warning unrelated to this phase").
It was never build-breaking locally because local verification throughout
Phases 3-7 ran `npm run build:vNN` without `CI=true`, where CRA only
prints it as a warning. GitHub Actions runners set `CI=true` in the job
environment automatically (not something `pages.yml` opts into), which
makes CRA treat *any* build warning as a hard failure - and Phase 6 was the
first time `v18`/`v19` were actually built by that CI job, so this is where
the long-latent issue first got exercised for real. v17 doesn't hit it
because it's still on Bootstrap 4.

Rather than papering over it with `CI=false` in the workflow (which would
silence every future warning, not just this one), added a targeted webpack
override in both `apps/v18/config-overrides.js` and `apps/v19/config-overrides.js`:
finds the `CssMinimizerPlugin` instance CRA wires into
`config.optimization.minimizer` and sets its `minimizerOptions` to
`{preset: ['default', {svgo: false}]}`, disabling just the SVG
sub-optimization within cssnano's default preset while leaving the rest of
CSS minification untouched.

**Verified** by rebuilding all three apps with `CI=true` set explicitly
(matching what the GitHub Actions runner does, which local testing had not
been doing) - `v17`/`v18`/`v19` all now `Compiled successfully.` under
`CI=true`, plus `test:v17`/`test:v18`/`test:v19` still passing. Confirmed
the built CSS still contains the same (now unminified-by-svgo, but valid
and unchanged) SVG data URIs rather than broken or missing ones.

## Phase 7 findings (round 3: React Ecosystem refresh, v19 Hooks gap)

Reviewed the `BuildingonReact`/"React Ecosystem" section (its intro page plus
`ReduxandFluxWorkflows`, `LayoutFrameworks`, `PerformanceandUsability`,
`OtherLibraries` — content shared identically across all three apps except
`PerformanceandUsability`) for currency, plus re-checked the Hooks page
divergence from the earlier Phase 7 rounds.

- **`LayoutFrameworks.md`**: "Material-UI" renamed to "MUI" in 2021 — updated
  the name/link, kept as an example despite `@material-ui/core` having been
  removed as a dead dependency back in Phase 0.5 (it's describing the
  ecosystem, not this app's own deps).
- **`OtherLibraries.md`**: swapped the `create-react-app`-as-the-way-to-start
  recommendation for `Vite`, since React officially deprecated CRA in 2025 —
  notable given this repo's own `UPDATE_PLAN.md` documents CRA as the
  unmaintained build tool that drove several phases of workarounds here.
  Also corrected the claim that Gatsby builds the official React website
  (it's Next.js now, at `react.dev`) and added a note on Gatsby's/
  `react-static`'s reduced maintenance activity since.
- **`BuildingonReact.md`**: softened the "over 65,000 dependent projects" NPM
  stat (written ~2020) to "tens of thousands" rather than guess a current
  number — `npmjs.com` blocked an automated fetch to verify it here; worth
  confirming the real figure in an environment that can reach it.
- **v19's Hooks page gained `useTransition`/`useId`** (copied from v18,
  content and example code unchanged — both are still valid, current React
  19 hooks): the earlier Phase 7 pilot round only added `use`/
  `useActionState` to v19 while adding `useTransition`/`useId` to v18, one
  new hook pair per app, without checking whether either pair was still
  relevant to the *other* app's target React version. Since React 18's
  hooks weren't removed in 19, v19 silently under-taught its own current
  version. `Hooks.md` also gained the automatic-batching paragraph v18
  already had (still true in React 19) and now lists all four newer hooks
  before the "rules to remember" section.
- **`PerformanceandUsability` (React Compiler) is still v19-only by earlier
  request**, left unchanged this round — React Compiler has since gained a
  React 17/18 compatibility runtime, so extending the mention to v18 is
  worth a deliberate follow-up call rather than folding into this pass.
- **Verified**: clean-room install plus `build:v17`/`test:v17`,
  `build:v18`/`test:v18`, `build:v19`/`test:v19` (with `CI=true`, matching
  the real deploy workflow) all pass.
- **Scope note**: this was a light editorial pass done from a sandboxed
  environment without general web access (couldn't verify the NPM stat,
  couldn't check whether other pages have similar staleness). Worth a
  broader sweep of the remaining pages from an environment with full
  browsing access to catch anything else the tutorial content has drifted
  on.

## Phase 8a findings (pilot: `apps/v19` CRA → Vite)

Swapped `react-scripts`/`react-app-rewired` for Vite in `apps/v19` only, replaced Jest
with Vitest, and re-implemented the React-version-isolation trick as a native Vite
`resolve.alias`. `apps/v17`/`apps/v18` are untouched (still CRA/Jest) — that's 8b.

- **`vite@^7.3.6`, not the newly-released `vite@^8`**: `vite@8`'s new default bundler
  ("Rolldown-powered Vite", replacing esbuild+Rollup) rejected JSX syntax in this app's
  `.js` files even with every documented workaround tried (`@vitejs/plugin-react`'s
  `include` option, `esbuild.loader`/`.include`/`.exclude`), including at the literal
  HTML-referenced entry point. Vite 7 (the previous stable major, esbuild+Rollup as
  before) built cleanly once configured correctly (below) — not worth chasing a
  brand-new default engine's rough edges for a pilot meant to set the pattern `apps/v18`
  in Phase 8b will reuse. `vitest@^3.2.7` similarly avoids `vitest@4`, whose *own*
  bundled Vite dependency pulled in the same Rolldown engine independent of the app's
  own pinned `vite` version, breaking tests the same way.
- **JSX-in-`.js` needs two separate fixes, not one**: this app's JSX-containing source
  uses a plain `.js` extension throughout (a CRA/babel-loader convention — babel
  auto-detects JSX regardless of extension). Vite's `@vitejs/plugin-react` only applies
  its JSX-aware Babel transform to `.jsx`/`.tsx` by default (fixed by widening its
  `include` to `**/*.{js,jsx}`), but esbuild's *own* transform (used for `.jsx`/`.tsx`
  natively, and for anything the react plugin doesn't otherwise handle) has a *separate*
  default `exclude: /\.js$/` on the assumption `.js` never contains JSX — excludes take
  priority over `include` when both match, so `esbuild.include`/`.loader: 'jsx'` alone
  silently did nothing until `exclude: []` was also set. The dependency pre-bundler
  (`optimizeDeps.esbuildOptions.loader`) needed the same `.js` → `jsx` loader mapping
  independently, since it's a separate esbuild pass. The literal HTML-referenced entry
  point (`src/index.js`) needed renaming to `.jsx` regardless — Vite's `vite:build-html`
  step parses that one file with Rollup's own (non-esbuild, non-babel) parser before any
  transform runs, so no config bridges that specific gap; every other `.js` file is fine
  once the excludes above are cleared.
- **`vite.config.js` replaces `config-overrides.js`**, alongside a Vitest `test` block in
  the same file (`defineConfig` from `vitest/config`, not `vite`, to get both merged).
  `.eslintrc.json`, `package.json`'s `browserslist`, and Bootstrap's CSS import are all
  unchanged — none of those are CRA/webpack-specific.
- **The react/react-dom `resolve.alias` + `dedupe` port over directly** from
  `config-overrides.js`'s webpack `resolve.alias` — same root cause (a shared transitive
  dependency, `react-bootstrap`'s `uncontrollable`, hoisted to the workspace root and
  resolving `react` from wherever *it* lives rather than `apps/v19`'s nested React 19
  copy), same fix, and CRA's `ModuleScopePlugin` dance isn't needed since Vite has no
  equivalent "no imports outside src/" restriction to route around.
- **`.md`/`.jsexample` files needed two Vite-specific adjustments**, since both are
  fetched at runtime as raw text (`readFile()` in `src/utils`, unchanged) rather than
  imported as JS: `assetsInclude: ['**/*.md', '**/*.jsexample']` tells Vite to treat them
  as static assets (yielding a URL on import) instead of trying to parse them as
  JS/JSON — CRA's webpack fell back to this for any unrecognized extension by default,
  Vite doesn't. Separately, Vite base64-inlines small assets by default
  (`build.assetsInlineLimit`, 4KB), which would hand `readFile()`'s `fetch(url)` a
  `data:` URI instead of a real path — `fetch()` support for `data:` URIs is
  inconsistent across browsers, so `build.assetsInlineLimit` is overridden to always
  emit real files for just those two extensions, leaving normal image inlining alone.
- **`index.html` moves from `public/` to the app root** (a hard Vite requirement, not a
  choice) and swaps CRA's `%PUBLIC_URL%` template placeholder for Vite's own
  `%BASE_URL%` (resolved from `vite.config.js`'s `base`), adding a
  `<script type="module" src="/src/index.jsx">` tag Vite needs in place of webpack
  injecting the bundle automatically. `public/404.html` and every other `public/` asset
  are untouched — Vite copies `public/` verbatim to the build output root exactly like
  CRA did, and the GitHub Pages SPA-redirect trick operates on browser URL structure at
  request time, independent of which bundler produced the files.
- **`vite build`'s `outDir` is set to `build`** (Vite's own default is `dist`) purely so
  `pages.yml`'s existing `apps/v19/build` reference (wired up in Phase 6) keeps working
  unchanged — `pages.yml` itself is still out of scope here (that's 8c).
- **Vitest needed a `vi.mock('react-bootstrap/Navbar', ...)`** the CRA/Jest setup didn't:
  rendering `<App/>` under Vitest hit the same "Invalid hook call" two-React-copies
  symptom as the `uncontrollable` issue above, but the `resolve.alias`/`dedupe` fix that
  solves it for the real (Vite-bundled) app doesn't reach it here. Root cause, confirmed
  by instrumenting `vite-node`'s own `shouldExternalize` locally: Vitest executes
  already-compiled CJS library code (like `react-bootstrap/cjs/Navbar.js`, itself loaded
  correctly via Vite's own resolver) with Node's *native* `require()` for that file's
  own internal requires, rather than routing every nested `require()` call back through
  Vite's resolver — so `Navbar.js`'s own `require('uncontrollable')` bypasses
  `resolve.alias` entirely and lands on the workspace-root-hoisted copy regardless of
  config. This is a hard architectural difference between Vitest (fast native execution
  for library code) and Jest (its own module registry intercepts every `require()`
  globally, which is why the old `config-overrides.js` needed its *own*, separately
  documented, `moduleNameMapper` entry for exactly this — Jest had the identical problem
  for the identical reason, just fixed via a mechanism specific to Jest). `vi.mock` sidesteps
  it by substituting Navbar before `react-bootstrap`'s real module (and its problematic
  `uncontrollable` import) ever loads, rather than trying to fix its internal resolution.
  Confirmed this is test-runner-specific, not a real app bug, by serving a production
  `vite build` output and driving it with Playwright: Navbar renders with zero console
  errors.
- **The `react-markdown` Jest mock (`src/testMocks/react-markdown.js`) is deleted, not
  ported**: it existed solely because Jest 27 (bundled with `react-scripts@5`) can't
  resolve package.json `exports` subpaths, which `react-markdown@10`'s ESM-only
  remark/rehype/unified dependency tree relies on throughout. Vitest resolves through
  Vite itself, which fully supports `exports` maps and ESM natively - the mock's reason
  to exist is gone. (Not exercised by the current smoke test either way - `App.test.js`
  renders the unmatched-route fallback, which doesn't reach `Info`/markdown rendering -
  so this wasn't re-verified via a passing markdown-rendering test specifically, only
  via the same browser verification below that already covers real markdown output.)
- **Verified**: clean-room install (`rm -rf node_modules apps/*/node_modules
  package-lock.json && npm install`) plus `build:v19`/`test:v19` pass, and
  `build:v17`/`test:v17`/`build:v18`/`test:v18` (still CRA/Jest) are unaffected. Served a
  production `vite build` output through a small script reproducing GitHub Pages' own
  per-directory `404.html` fallback behavior (`serve`'s own default 404 page doesn't
  replicate this, so a plain `serve`/`http-server` isn't sufficient for this specific
  check) and drove it with Playwright: a direct/refreshed deep-link load
  (`/first-to-react/v19/page/3.1`) round-trips through the `404.html` redirect script and
  renders the real JSX page (confirmed by page-specific content, not just the sidebar),
  including its live code editors and markdown rendering — the same check Phase 5 ran
  for v17's `homepage` move, re-run here to confirm Vite's build output shape (`base`,
  asset paths) didn't break it. Also drove `vite`'s own dev server the same way. The only
  console warning on either was the same pre-existing `<img>`-in-`<div>`-in-`<p>`
  markdown-nesting warning already documented since Phase 2, confirming no regression.

## Phase 8b findings (`apps/v17`/`apps/v18` CRA → Vite)

Repeated the Phase 8a pilot pattern for the remaining two apps. `apps/v18` (react-bootstrap@^2,
react-markdown@^10, react-router-dom@^7 - the same major generation as the v19 pilot) needed
almost no adaptation beyond the app-specific paths. `apps/v17` (still on the pre-Phase-3
dependency set - react-bootstrap@^1, react-markdown@^4, react-live@^2, react-router-dom@^5)
surfaced two real, previously-latent bugs that a clean-room install had never actually exercised
since they were introduced.

- **`apps/v18`**: `vite.config.js`, `index.html`, and the Vitest setup (`setupTests.js`'s
  `/vitest` entry point, the `TextEncoder`/`TextDecoder` polyfill, `App.test.js`'s Navbar mock)
  all ported byte-for-byte from `apps/v19`'s pilot, only swapping `v19` → `v18` in the `base`
  path and comments - identical dependency majors mean identical bundler-facing problems.
  `src/testMocks/react-markdown.js` deleted for the same reason Phase 8a deleted v19's copy
  (Vitest resolves `exports` maps natively; the mock existed only to work around Jest 27).
  The Phase 6 `postcss-svgo`/`CssMinimizerPlugin` workaround (added to `config-overrides.js`
  after PR #16's CI failure) is **not** ported: Vite's own CSS minifier isn't cssnano/svgo-based,
  so the warning it worked around doesn't exist under Vite - confirmed by a clean `CI=true` build
  with no `config-overrides.js` equivalent at all.
- **`apps/v17` doesn't need the `react`/`react-dom` `resolve.alias`/`dedupe`** that v18/v19 both
  carry: that fix exists because v18 and v19 both declare `react-bootstrap@^2.x`, so npm dedupes
  their shared `uncontrollable` transitive dependency to one hoisted copy that resolves the wrong
  React major for whichever app didn't win the hoist. `apps/v17` is the *only* workspace member on
  `react-bootstrap@^1.x`, so there's no sibling to collide with - it already resolves `uncontrollable`
  and `react`/`react-dom` from the same workspace-root-hoisted React 17 copy. Confirmed by removing
  the alias entirely and verifying a clean install still nests exactly one React copy.
- **Bug found: `prism-react-renderer` hoisting was non-deterministic across clean installs**,
  independent of Vite. `apps/v17`'s `Editor.jsx` imports `prism-react-renderer/themes/vsDark`
  directly (react-live@2's v1.x-era API), while `react-live@2.4.1` itself declares a real (non-peer)
  `dependencies.prism-react-renderer: "^1.2.1"`; apps/v18/v19 separately declare
  `"prism-react-renderer": "^2.4.1"` as their own direct dependency. Since neither range is
  satisfiable by the other, npm's arborist has to choose which one wins the shared root-level
  hoist slot and nest the other - and empirically, that choice wasn't stable across repeated
  clean-room reinstalls of the *same* `package.json` (verified by installing from scratch several
  times in a row). When v2.x won the root slot, `apps/v17`'s direct subpath import resolved to it
  instead of react-live's own nested v1.x copy, and `themes/vsDark` doesn't exist in v2's
  single-named-export API - `[vite]: Rollup failed to resolve import` at build time. This was
  never CRA/webpack-specific and could in principle have bitten any past clean-room install since
  Phase 3 added the v18/v19 dependency; it just happened not to. Fixed by adding
  `"prism-react-renderer": "^1.3.5"` as an explicit `apps/v17` dependency, the same pattern
  already used for `react`/`react-dom` on v18/v19: an explicit direct dependency always nests its
  own copy under the declaring app's own `node_modules`, immune to whichever way root hoisting
  happens to fall.
- **Bug found: the root `package.json` `overrides` entry for `react-markdown`'s peer had been
  silently broken since Phase 3**, and separately, even corrected, is flaky under npm 10.
  The entry read `"react-markdown": {"4.3.1": {"react": "^17.0.1"}}` - per npm's own docs
  (`npm help package.json`), version-scoping an override requires the version to be part of the
  *key* (`"react-markdown@4.3.1"`), not a nested object level; the form in place was a silent
  no-op. It never surfaced because every clean-room verification since Phase 3 happened to run
  `npm install` against a `package-lock.json` that already encoded a working resolution from
  before the (broken) override was introduced - `npm install` replays a valid existing lockfile
  rather than re-deriving one from scratch, so the broken override was never actually exercised.
  Deleting `package-lock.json` (this phase's clean-room testing habit) finally exposed it: a
  from-scratch resolve hits the raw peer conflict (`react-markdown@4.3.1` wants
  `react@"^15.0.0 || ^16.0.0"`) and fails outright. Corrected to the documented key syntax -
  but that alone was still non-deterministic under the sandbox's bundled npm 10.9.7 (roughly a
  1-in-4 success rate across repeated from-scratch installs of the identical `package.json`,
  isolated by a minimal reproduction outside this repo). Re-scoping the override by the
  *workspace name* instead of the dependency version
  (`"first-to-react-v17": {"react-markdown": {"react": "^17.0.1"}}`) didn't fully fix the
  non-determinism either. npm 11.19.0 and 12.0.2 both resolved the identical `package.json`
  deterministically across 6/6 attempts each; bisecting further wasn't pursued. Fixed by pinning
  `"engines.npm": ">=11"` and having `pages.yml`'s install step run through a one-off
  `npx --yes npm@11 install` rather than the runner's bundled npm, so CI doesn't depend on a
  human or the runner image happening to have a new-enough npm on `PATH`. Bumping `react-markdown`
  past 4.3.1 (5.x+ has a peer range of `react: '>=16'` with no conflict at all) would sidestep
  this differently, but that's the version-bump content decision Phase 0's findings already
  flagged as needing an explicit call, not something to fold into a build-tooling phase.
- **Bug found: `apps/v17`'s `Editor.jsx` line only reproduces under a real browser, not the test
  suite** - Vitest's smoke test doesn't render markdown/live-editor content (same tradeoff noted
  in Phase 8a for v19), so the `prism-react-renderer` and `process`/`path` failures below were
  only caught by an actual `vite build` + Playwright pass, not `npm run test:v17`.
- **`apps/v17`-only: `process`/`path` polyfill gap, re-emerging under Vite.** `react-markdown@4`'s
  old `unified@6`/`vfile` dependency chain (still CJS, pre-dating the remark/rehype ESM rewrite
  `apps/v18`/`v19` already sit on) has `vfile/core.js` doing `require('path')` and reading
  `process.cwd()` as a bare global - the *exact* two Node-core gaps Phase 0.5's findings already
  documented webpack 5 needing a `config-overrides.js` fallback for. Vite doesn't auto-polyfill
  them either, so removing `config-overrides.js` reintroduced the gap: the built app rendered a
  blank markdown page with `ReferenceError: process is not defined` in the console, only visible
  via the browser check, not the build or test suite. `path` gets the same
  `resolve.alias: {path: 'path-browserify'}` swap as before. `process` needed a different fix:
  esbuild's `define` only accepts literal/entity-name replacement values (no callable stand-in),
  so `process.cwd()` needs a *real* `globalThis.process` object at runtime, not a text
  substitution - `define: {process: 'globalThis.process'}` points the bare identifier at it, and
  `src/index.jsx` sets `globalThis.process` from the `process/browser` polyfill (the same package
  the old webpack `ProvidePlugin` fallback used) as its first import, before any markdown
  rendering can run. (An earlier attempt also added `resolve.alias.process: 'process/browser'`
  for symmetry with `path` - that broke `index.jsx`'s own `import process from 'process/browser'`
  by prefix-matching it to `process/browser/browser`, since Vite/Rollup aliases match by string
  prefix, not exact string, by default. Removed - nothing in this dependency chain imports a bare
  `process` module, only reads the global, so the alias was unnecessary as well as wrong.)
- **Verified**: clean-room installs (`rm -rf node_modules apps/*/node_modules package-lock.json`,
  `npx --yes npm@11 install`) succeeded 6/6 in a row after the npm-version and dependency fixes
  above (vs. roughly 1/4 on the sandbox's bundled npm 10.9.7 before them), plus
  `build:v17`/`test:v17`, `build:v18`/`test:v18`, `build:v19`/`test:v19` all passing under
  `CI=true`. Assembled the exact deploy tree `pages.yml` produces (landing page +
  `apps/v17/build`/`v18/build`/`v19/build` under `/first-to-react/v17`, `/v18`, `/v19`) and served
  it through a script reproducing GitHub Pages' per-directory `404.html` fallback, driven by
  Playwright: the landing page and all three apps' home pages render; a direct/refreshed deep link
  (`/first-to-react/vNN/page/3.1`) round-trips through the `404.html` redirect script and renders
  the real JSX page on all three; `apps/v17`'s markdown content and live code editor render with
  zero console errors (beyond the expected, harmless initial 404 the redirect trick itself
  causes). No regressions versus the pre-migration CRA build on any of the three apps.

## Phase 8c findings (`pages.yml` update)

- **Build commands unchanged**: `npm run build:v17`/`build:v18`/`build:v19` already wrapped
  `vite build` instead of `react-app-rewired build` transparently (Phase 8a/8b changed what's
  inside the npm script, not the script name), and every app's `vite.config.js` keeps
  `build.outDir: 'build'` specifically so the Phase 5/6 `pages.yml` deploy-tree assembly step
  (`cp -r apps/vNN/build/. site/vNN/`) needs no changes either.
- **Install step changed**: `npm install` → `npx --yes npm@11 install`, to fix the npm-10
  ERESOLVE non-determinism documented in the Phase 8b findings above (also backed by
  `engines.npm: ">=11"` in the root `package.json`). Runs through a one-off npx-fetched copy of
  npm rather than mutating the runner's global npm install, since the latter isn't guaranteed to
  succeed (or be desirable) on a shared CI image.
- **Verified**: reproduced the exact `pages.yml` "Install and Build" step locally
  (`npx --yes npm@11 install` from a fully clean tree, then the three `build:vNN` commands under
  `CI=true`) six times in a row with no failures, and reproduced the "Assemble deploy tree" step's
  resulting `site/` tree structure - unchanged shape, verified in the Phase 8b findings above.

## Phase 8.5 findings (drop npm workspaces)

Landed independently in a separate session that hit the exact same symptom Phase 8b's findings
document — a `process is not defined` crash from `react-markdown`'s old `vfile` dependency —
but traced it to a different root cause and reached it before Phase 8b/8c had merged, requiring
reconciliation once both sides landed.

- **Root cause here wasn't `vfile` itself, it was npm hoisting resolving the wrong copy of
  `react-markdown` entirely**: `apps/v19/node_modules/react-markdown` was missing from disk
  (despite `package-lock.json` declaring it), so Vite's dependency resolution walked up to the
  workspace-root-hoisted `react-markdown@4.3.1` — a copy meant for `apps/v17` — instead of
  `apps/v19`'s own `^10.1.0`. That old v4 tree's `vfile@2.3.0` is what threw, the same as Phase
  8b's finding for `apps/v17`, but for `apps/v19` this was a resolution accident, not an
  inherent gap in what Vite polyfills.
- **Fix chosen: stop hoisting altogether**, rather than make hoisting reliable. Removed the root
  `package.json`'s `workspaces` field; `apps/v17`/`v18`/`v19` each get their own `npm install`,
  own `node_modules`, own `package-lock.json`. Root `package.json` now has no dependencies of
  its own — orchestration scripts (`build:vNN`/`start:vNN`/`test:vNN`) call
  `npm run <script> --prefix apps/vNN` instead of `--workspace=apps/vNN`. `pages.yml`'s install
  step runs `npm --prefix apps/vNN ci` once per app instead of one root `npm install`.
- **This makes most of Phase 8b/8c's hoisting-determinism fixes unnecessary, not wrong**: they
  fixed the *shared* `node_modules` to resolve deterministically (corrected `overrides` syntax,
  `engines.npm: ">=11"`, `pages.yml`'s `npx npm@11` install, an explicit `prism-react-renderer`
  dependency to stop it deferring to whichever app's version won the hoist). With each app fully
  isolated, there's no shared resolution left to be non-deterministic about — `apps/v17`'s
  `prism-react-renderer@^1.x` and `apps/v18`/`v19`'s `^2.x` can no longer collide because they're
  never candidates for the same hoist slot. The one Phase 8b fix that's unrelated to hoisting —
  `apps/v17`'s `path`/`process` polyfill for `vfile`'s old CJS code (`vite.config.js`'s
  `resolve.alias`/`define`, `src/index.jsx`'s `globalThis.process` assignment) — is orthogonal
  and still needed either way; it carried over untouched.
- **Reconciliation, once Phase 8b/8c (`#19`) and this both landed**: merged `master` into this
  branch. Real conflicts were limited to the root `package.json` (workspaces/overrides vs.
  prefix scripts — kept the no-workspaces side), `pages.yml`'s install step (same), this file's
  Status table, and `apps/v17/package-lock.json` (git's rename-detection paired the deleted root
  lockfile against the new per-app one; not a hand-mergeable conflict — deleted and regenerated
  fresh). `apps/v17`/`apps/v18`'s `package.json` merged automatically with no conflict (Phase
  8b's Vite/dependency changes and this phase's `overrides`/`node`-engine changes touched
  non-overlapping regions), and every other Phase 8b/8c file (`vite.config.js`,
  `config-overrides.js` deletions, `index.jsx` renames, `App.test.js`/`setupTests.js`) applied
  cleanly since this phase never touched them. Dropped `engines.npm: ">=11"` and `pages.yml`'s
  `npx npm@11` step as no longer needed (see above); bumped `pages.yml`'s `setup-node` from 20 to
  24 to match this session's earlier `node: ">=24"` bump (`apps/v19`'s `jsdom@30` requires
  Node ≥22.22.2, which 20 doesn't satisfy).
- **Verified**: fresh `npm install` in each of `apps/v17`/`v18`/`v19` post-merge, then
  `build:v17`/`test:v17`, `build:v18`/`test:v18`, `build:v19`/`test:v19` all passing. Confirmed
  no stray conflict markers remained anywhere in the tree, and that this session's independent
  `TableOfContents` layout fixes (see the git log around this merge) — untouched by Phase
  8b/8c — survived in all three apps.

## Status

| Phase | Status |
|---|---|
| 0. Safe vulnerability fixes | Done — lockfile-only, see findings above |
| 0.5. react-scripts 4 → 5 | Done — see findings above |
| 1. Repo restructure | Done — see findings above |
| 2. `apps/v17` remaining hygiene cleanup | Done — see findings above |
| 3. Scaffold `apps/v19` | Done — see findings above |
| 4. Scaffold `apps/v18` | Done — see findings above |
| 5. Landing/selector page | Done, v17-only by request — see findings above |
| 6. CI/CD rewrite | Done — all three apps build/deploy; v18/v19 stay unlinked from the landing page by request, see Phase 6 findings |
| 7. Content divergence | In progress — original plan wording's named topics (Hooks, `createRoot`, `ref-as-prop`, React Compiler) are done for v18/v19, see Phase 7 findings; remaining pages are ongoing, editorial-priority-driven follow-up work, not a fixed scope to complete |
| 8. Migrate build tooling from CRA to Vite | Done — 8a (`apps/v19` pilot), 8b (`apps/v17`/`apps/v18`), and 8c (`pages.yml`) all landed, see Phase 8a/8b/8c findings |
| 8.5. Drop npm workspaces | Done — see Phase 8.5 findings |
| 9. Share common code across apps | Not started — see plan entry above |
