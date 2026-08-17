# Performance and Usability

`React.memo`, `useMemo`, and `useCallback` (covered in the Hooks section) have long been the main tools for avoiding unnecessary re-renders and expensive recalculations - but they're manual. It's on the developer to remember to add them, keep their dependency arrays correct, and mentally track cache invalidation as the code changes.

#### React Compiler

React 19 ships alongside the __[React Compiler](https://react.dev/learn/react-compiler)__, a separate, opt-in build-time tool that analyzes component code and automatically applies the equivalent of `memo`/`useMemo`/`useCallback` wherever it's safe to do so, without the developer writing them by hand.

A few things worth knowing about it:

* It's a __build-time__ tool, not a runtime API - there's no new hook or component to import from `react`. Enabling it means adding a plugin to the build config (e.g. `babel-plugin-react-compiler`, or the equivalent Vite/Next.js plugin), not changing component code.
* It relies on components and Hooks following the [Rules of React](https://react.dev/reference/rules) - purity, treating _props_/_state_ as immutable, calling Hooks unconditionally at the top level - the same rules already followed throughout this tutorial. Code that breaks those rules is exactly the code the compiler can't safely optimize.
* It doesn't remove the need to understand `useMemo`/`useCallback`/`memo`. Existing manual memoization keeps working alongside it, and understanding what the compiler automates is exactly what makes its behavior predictable in the code paths it doesn't reach (yet).
