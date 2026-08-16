const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    path: require.resolve('path-browserify'),
    process: require.resolve('process/browser'),
  };
  config.plugins.push(
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
  );
  return config;
};
