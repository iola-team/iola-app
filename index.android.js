import {AppRegistry, NativeModules} from 'react-native';

import Application from './src';

// Android specific configuration
const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

AppRegistry.registerComponent('ApolloMessenger', () => Application);
