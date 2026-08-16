
import info from './StateandLifecycle.md';
import example1 from './BasicState.jsexample';
import example2 from './MultiState.jsexample';
import example3 from './MountAndUnmount.jsexample';
import example4 from './ClassPropUpdate.jsexample';
import example5 from './FunctionalPropUpdate.jsexample';

const config = {
  info,
  name: 'State',
  examples: [
    {
      name: 'Basic State',
      example: example1,
    },
    {
      name: 'Multiple State',
      example: example2,
    },
    {
      name: 'Mount and Unmount',
      example: example3,
    },
    {
      name: 'Class Prop Update',
      example: example4,
    },
    {
      name: 'Functional Prop Update',
      example: example5,
    },
  ],
  children: [
  ],
};

export default config;
