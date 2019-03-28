import React from 'react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import { Text } from 'native-base';

import { getContainerDecorator } from '~storybook';
import ConnectivityIndicator from './ConnectivityIndicator';

const stories = storiesOf('Components/ConnectivityIndicator', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContainerDecorator());

// Stories
stories.add('Default', () => (
  <ConnectivityIndicator isOnline={boolean('Is online', true)}>
    <Text>Some content...</Text>
  </ConnectivityIndicator>
));
