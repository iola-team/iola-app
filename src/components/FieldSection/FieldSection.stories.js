import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { Text } from 'native-base';

import { getContainerDecorator } from '~storybook';
import FieldSection from './FieldSection';

const stories = storiesOf('Components/FieldSection', module);

// Decorators
stories.addDecorator(getContainerDecorator());

// Stories
stories.add('Default', () => (
  <FieldSection label="Label">
    <Text style={{ padding: 20 }}>Section content...</Text>
  </FieldSection>
));

stories.add('Loading', () => (
  <FieldSection loading>
    <Text style={{ padding: 20 }}>Section content...</Text>
  </FieldSection>
));