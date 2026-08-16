
import info from './JSX.md';
import example1 from './JSX1.jsexample';
// import example2 from './JSX2.jsexample';
import example3 from './JSX3.jsexample';
import example4 from './JSX4.jsexample';
// import example5 from './JSX5.jsexample';
// import example6 from './JSX6.jsexample';
// import example7 from './JSX7.jsexample';

const config = {
  info,
  name: 'JSX',
  examples: [
    {
      name: 'Basic JSX',
      example: example3,
    },
    {
      name: 'Inline JS',
      example: example4,
    },
    {
      name: 'No JSX',
      example: example1,
    },
    // {
    //   name: 'With JSX',
    //   example: example2,
    // },
    // {
    //   name: 'Example 5',
    //   example: example5,
    // },
    // {
    //   name: 'Example 6',
    //   example: example6,
    // },
    // {
    //   name: 'Example 7',
    //   example: example7,
    // },
  ],
  children: [
  ],
};

export default config;
