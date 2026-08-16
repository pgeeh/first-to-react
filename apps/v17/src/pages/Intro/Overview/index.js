
import info from './Overview.md';
import example1 from './Overview1.jsexample';
import example2 from './Overview2.jsexample';
import example3 from './Overview3.jsexample';

const config = {
  info,
  name: 'Overview',
  examples: [
    {
      name: 'Example1',
      example: example1,
    },
    {
      name: 'Example2',
      example: example2,
    },
    {
      name: 'Example3',
      example: example3,
    },
  ],
  children: [
  ],
};

export default config;
