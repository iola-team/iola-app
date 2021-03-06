import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { Button, Text } from 'native-base';

import { getContentDecorator } from '~storybook';
import ImagePickerActionSheet from './ImagePickerActionSheet';

const stories = storiesOf('Components/ImagePickerActionSheet', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

const renderButton = callbacks => show => (
  <Button onPress={() => show(callbacks)}>
    <Text>Show</Text>
  </Button>
);

// Stories
stories.add('Default', () => (
  <ImagePickerActionSheet
    onSourceSelect={action('onSelectSource')}
    onCancel={action('onCancel')}
  >
    {renderButton()}
  </ImagePickerActionSheet>
));

stories.add('With extra option', () => {
  const options = [
    'Roman Banan',
    'Delete',
  ];

  return (
    <ImagePickerActionSheet
      options={options}
      destructiveButtonIndex={1}
      onPress={action('onPress')}
      onSourceSelect={action('onSelectSource')}
      onCancel={action('onCancel')}
    >
      {renderButton()}
    </ImagePickerActionSheet>
  );
});

stories.add('Render prop callbacks', () => {
  const options = [
    'Roman Banan',
    'Delete',
  ];

  return (
    <ImagePickerActionSheet
      options={options}
      destructiveButtonIndex={1}
    >
      {renderButton({
        onPress: action('onPress (render prop)'),
        onSourceSelect: action('onSourceSelect (render prop)'),
        onCancel: action('onCancel (render prop)'),
      })}
    </ImagePickerActionSheet>
  );
});
