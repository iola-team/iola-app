import { configure, addDecorator } from '@storybook/react-native';

import { getRootDecorator } from './decorators';
import { loadStories } from './storyLoader';

addDecorator(getRootDecorator());

configure(loadStories, module);

/**
 * Delay storybook configuration to prevent channel errors
 *
 * Related issue: https://github.com/storybooks/storybook/issues/1192
 *
 * TODO: Refactor it whe the issue is resolved
 */
export default () => {
  require('@storybook/addon-console');
};
