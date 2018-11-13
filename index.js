import { AppRegistry, NativeModules, Platform, YellowBox } from 'react-native';

import Application from './src';

if (Platform.OS === 'android') {
  NativeModules.UIManager.setLayoutAnimationEnabledExperimental &&
  NativeModules.UIManager.setLayoutAnimationEnabledExperimental(true);
}

AppRegistry.registerComponent('ApolloMessenger', () => Application);

/**
 * TODO: Remove when it will be possible
 */
YellowBox.ignoreWarnings([
  /**
   * Temporarily disable warning about deprecated React lifecycle methods.
   * We should wait till native-base adds support of the latest React and then remove this code.
   */
  'Warning: componentWillMount',
  'Warning: componentWillUpdate',
  'Warning: componentWillReceiveProps',
  'Warning: isMounted',

  /**
   * Temporarily disable warning about require cycle,
   * since all of them are from node_modules and we can not fix them
   */
  'Require cycle:',
]);
