import useEffect from './useEffect';
import useState from './useState';
import useReducer from './useReducer';
import useContext from './useContext';

import info from './Hooks.md';
import example from './Hooks.jsexample';

const config = {
  info,
  name: 'Hooks',
  examples: [
    {
      name: 'Example 1',
      example,
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
