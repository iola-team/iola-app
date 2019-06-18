import { addDecorator, addParameters } from '@storybook/react-native';
import { themes } from '@storybook/theming';

import { getRootDecorator } from './decorators';

// Option defaults.
addParameters({
  options: {
    theme: themes.normal,
  },
});

addDecorator(getRootDecorator());