// import PropOverride from './PropOverride';
// import LiveEditing from './LiveEditing';
// import Overview from './Overview';

import info from './Intro.md';
import example1 from './Intro1.jsexample';
import example2 from './Intro2.jsexample';
import example3 from './Intro3.jsexample';
// import example4 from './Intro4.jsexample';

const config = {
  info,
  name: 'How to Use Examples',
  examples: [
    {
      name: 'Live Editor',
      example: example1,
    },
    {
      name: 'Fix An Error',
      example: example2,
    },
    {
      name: 'Prop Override',
      example: example3,
    },
    // {
    //   name: 'Example 4',
    //   example: example4,
    // },
  ],
  children: [
    // Overview,
    // LiveEditing,
    // PropOverride,
  ],
};

export default config;
