import useContext from './useContext';
import useReducer from './useReducer';
import useEffect from './useEffect';
import useState from './useState';
import useMemo from './useMemo';
import useCallback from './useCallback';
import useTransition from './useTransition';
import useId from './useId';
import useDeferredValue from './useDeferredValue';
import useSyncExternalStore from './useSyncExternalStore';
import use from './use';
import useActionState from './useActionState';
import useOptimistic from './useOptimistic';
import useFormStatus from './useFormStatus';

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
    useTransition,
    useId,
    useDeferredValue,
    useSyncExternalStore,
    use,
    useActionState,
    useOptimistic,
    useFormStatus,
  ],
};

export default config;
