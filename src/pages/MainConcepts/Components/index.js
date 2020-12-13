import ClassComponents from './ClassComponents';
import FunctionalComponents from './FunctionalComponents';

import info from './Components.md';
import example1 from './Minimal.jsexample';
import example2 from './Components.jsexample';

const config = {
  info,
  name: 'Components',
  examples: [
    {
      name: 'Minimal',
      example: example1,
    },
    {
      name: 'With Props',
      example: example2,
    },
  ],
  children: [
    ClassComponents,
    FunctionalComponents,
  ],
};

export default config;
