import ClassComponents from './ClassComponents';
import FunctionalComponents from './FunctionalComponents';

import info from './Components.md';
import code from './Components.jsexample';

const config = {
  info,
  name: 'Components',
  code,
  children: [
    ClassComponents,
    FunctionalComponents,
  ],
};

export default config;
