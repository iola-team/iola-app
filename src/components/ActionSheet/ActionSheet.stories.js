import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { Button, Text } from 'native-base';

import { getContentDecorator } from '~storybook';
import ActionSheet from './ActionSheet';

const stories = storiesOf('Components/ActionSheet', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

const props = {
  options: [
    'Cancel',
    'Choose from camera',
    'Choose from library',
    'Roman Banan',
    'Delete',
  ],
  cancelButtonIndex: 0,
  destructiveButtonIndex: 4,
};

// Stories
stories.add('No title and message', () => (
  <ActionSheet
    {...props}
    onPress={action('onPress')}
  >
    {show => (
      <Button onPress={() => show()}>
        <Text>Show</Text>
      </Button>
    )}
  </ActionSheet>
));

stories.add('With title', () => (
  <ActionSheet
    {...props}
    onPress={action('onPress')}
    title="Edit photo"
  >
    {show => (
      <Button onPress={() => show()}>
        <Text>Show</Text>
      </Button>
    )}
  </ActionSheet>
));

stories.add('With title and message', () => (
  <ActionSheet
    {...props}
    onPress={action('onPress')}
    title="Edit photo"
    message="Are you sure?"
  >
    {show => (
      <Button onPress={() => show()}>
        <Text>Show</Text>
      </Button>
    )}
  </ActionSheet>
));

stories.add('Render prop callback', () => (
  <ActionSheet
    {...props}
    title="Edit photo"
    message="Are you sure?"
  >
    {show => (
      <Button onPress={() => show({ onPress: action('onPress (render prop)') })}>
        <Text>Show</Text>
      </Button>
    )}
  </ActionSheet>
));
