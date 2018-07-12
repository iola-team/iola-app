/**
 * Shim global modules to make some third party libs working
 * TODO: maybe remove
 */
import './shim';

import { AppRegistry, NativeModules, Platform, YellowBox } from 'react-native';

import Application from './src';

if (Platform.OS === 'android') {
  NativeModules.UIManager.setLayoutAnimationEnabledExperimental &&
  NativeModules.UIManager.setLayoutAnimationEnabledExperimental(true);
}

AppRegistry.registerComponent('ApolloMessenger', () => Application);

/**
 * Temporarily disable warning about deprecated React lifecycle methods.
 * We should wait till native-base adds support of the latest React and then remove this code.
 *
 * TODO: Remove when it will be possible
 */
YellowBox.ignoreWarnings([
  'Warning: componentWillMount',
  'Warning: componentWillUpdate',
  'Warning: componentWillReceiveProps',
  'Warning: isMounted'
]);
