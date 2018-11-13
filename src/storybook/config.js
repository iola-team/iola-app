import '@storybook/addon-console';
import { addDecorator } from '@storybook/react-native';

import { getRootDecorator } from './decorators';

addDecorator(getRootDecorator());