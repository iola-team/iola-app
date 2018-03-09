import { AppRegistry, NativeModules, Platform } from 'react-native';

import Application from './src';

if (Platform.OS === 'android') {
  NativeModules.UIManager.setLayoutAnimationEnabledExperimental &&
  NativeModules.UIManager.setLayoutAnimationEnabledExperimental(true);
}

AppRegistry.registerComponent('ApolloMessenger', () => Application);
