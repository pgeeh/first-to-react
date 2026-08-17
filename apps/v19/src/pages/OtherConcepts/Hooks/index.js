import useContext from './useContext';
import useReducer from './useReducer';
import useEffect from './useEffect';
import useState from './useState';
import useMemo from './useMemo';
import useCallback from './useCallback';
import use from './use';
import useActionState from './useActionState';

import info from './Hooks.md';
// import example from './Hooks.jsexample';

const config = {
  info,
  name: 'Hooks',
  examples: [
    // {
    //   name: 'Example 1',
    //   example,
    // },
  ],
  children: [
    useState,
    useMemo,
    useEffect,
    useCallback,
    useReducer,
    useContext,
    use,
    useActionState,
  ],
};

export default config;
