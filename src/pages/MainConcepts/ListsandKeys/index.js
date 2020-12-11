
import info from './ListsandKeys.md';
import example1 from './CorrectKeys.jsexample';
import example2 from './IncorrectKeys.jsexample';
import example3 from './ForcedKeyChange.jsexample';

const config = {
  info,
  name: 'Lists and Keys',
  examples: [
    {
      name: 'Correct Keys',
      example: example1,
    },
    {
      name: 'Incorrect Keys',
      example: example2,
    },
    {
      name: 'Forced Key Change',
      example: example3,
    },
  ],
  children: [
  ],
};

export default config;
