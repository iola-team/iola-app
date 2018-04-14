import React from 'react';
import { storiesOf } from '@storybook/react-native';
import {
  Text
} from 'native-base';

import { getBorderedDecorator, getContentDecorator } from 'storybook';
import AvatarToolbar from './AvatarToolbar';

const stories = storiesOf('Components/AvatarToolbar', module)
  .addDecorator(getBorderedDecorator())
  .addDecorator(getContentDecorator({ centered: true }));

stories.add('Default', () => (
  <Text>Hello Storybook!!!</Text>
));

stories.add('Test', () => (
  <Text>Hello Test Storybook!!!</Text>
));
