import { configure, addDecorator } from '@storybook/react-native';

import { loadStories } from './storyLoader'

configure(loadStories, module);
