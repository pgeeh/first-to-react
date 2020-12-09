
import info from './Intro.md';
import example1 from './Intro1.jsexample';
import example2 from './Intro2.jsexample';
import example3 from './Intro3.jsexample';
import example4 from './Intro4.jsexample';

const config = {
  info,
  name: 'Intro',
  examples: [
    {
      name: 'Example 1',
      example: example1,
    },
    {
      name: 'Example 2',
      example: example2,
    },
    {
      name: 'Example 3',
      example: example3,
    },
    {
      name: 'Example 4',
      example: example4,
    },
  ],
};

export default config;
