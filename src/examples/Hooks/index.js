import useEffect from './useEffect';
import useState from './useState';
import useReducer from './useReducer';
import useContext from './useContext';

import info from './Hooks.md';
import code from './Hooks.jsexample';

const config = {
  info,
  name: 'Hooks',
  code: [
    {
      name: 'Example 1',
      code,
    },
  ],
  children: [
    useState,
    useEffect,
    useReducer,
    useContext,
  ],
};

export default config;
