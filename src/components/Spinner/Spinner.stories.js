import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { Button, Text } from 'native-base';

import { getContentDecorator } from 'storybook';
import Spinner from './Spinner';

const stories = storiesOf('Components/Spinner', module);

// Decorators
stories.addDecorator(getContentDecorator({ padder: true }));

stories.add('With button', () => (
  <Button style={{ position: 'relative' }} block>
    <Text>Sign In</Text>
    <Spinner style={{ position: 'absolute', right: 20 }} />
  </Button>
));
