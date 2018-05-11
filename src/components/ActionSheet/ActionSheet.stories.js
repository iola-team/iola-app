import React from 'react';
import { number, withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import {
  View,
  Button,
  Text,
} from 'native-base';

import { getContentDecorator } from 'storybook/index';
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
  onPress: action('onPress'),
}

// Stories
stories.add('No title and message', () => {
  return (
    <ActionSheet
      {...props}
    >
      {show => (
        <Button onPress={() => show()}>
          <Text>Show</Text>
        </Button>
      )}
    </ActionSheet>
  );
});

stories.add('With title', () => {
  return (
    <ActionSheet
      {...props}
      title={"Edit photo"}
    >
      {show => (
        <Button onPress={() => show()}>
          <Text>Show</Text>
        </Button>
      )}
    </ActionSheet>
  );
});

stories.add('With title and message', () => {
  return (
    <ActionSheet
      {...props}
      title={"Edit photo"}
      message={"Are you sure?"}
    >
      {show => (
        <Button onPress={() => show()}>
          <Text>Show</Text>
        </Button>
      )}
    </ActionSheet>
  );
});
