import ReduxandFluxWorkflows from './ReduxandFluxWorkflows';
import LayoutFrameworks from './LayoutFrameworks';
// import PerformanceandUsability from './PerformanceandUsability';
import OtherLibraries from './OtherLibraries';

import info from './BuildingonReact.md';

const config = {
  info,
  name: 'React Ecosystem',
  children: [
    ReduxandFluxWorkflows,
    LayoutFrameworks,
    // PerformanceandUsability,
    OtherLibraries,
  ],
};

export default config;
