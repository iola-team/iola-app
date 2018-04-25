import React from 'react';
import { withHandlers } from 'recompose';
import { storiesOf } from '@storybook/react-native';

import { getContentDecorator } from 'storybook/index';
import componentTemplate from './ComponentTemplate';

const stories = storiesOf('Components/ComponentTemplate', module);

// Decorators
stories.addDecorator(getContentDecorator({ padder: true }));

// Stories
stories.add('Default', () => (
  <componentTemplate />
));
