import ClassComponents from './ClassComponents';
import FunctionalComponents from './FunctionalComponents';

import info from './Components.md';
import example from './Components.jsexample';

const config = {
  info,
  name: 'Components',
  examples: [
    {
      name: 'Class Vs Functional',
      example,
    },
  ],
  children: [
    ClassComponents,
    FunctionalComponents,
  ],
};

export default config;
