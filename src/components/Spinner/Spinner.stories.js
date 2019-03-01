import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { Button, Text } from 'native-base';

import { getContentDecorator } from '~storybook';
import Spinner from './Spinner';

const stories = storiesOf('Components/Spinner', module);

// Decorators
stories.addDecorator(getContentDecorator({ padder: true }));

stories.add('With button', () => (
  <Button block>
    <Text>Sign In</Text>
    <Spinner />
  </Button>
));
