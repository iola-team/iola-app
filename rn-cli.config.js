module.exports = {

  /**
   * Allow using Node core modules
   * TODO: currently native node modules are used by `subscription-transport-sse` module only. So it might be better to rewrite this module.
   */
  extraNodeModules: require('node-libs-react-native'),
};
