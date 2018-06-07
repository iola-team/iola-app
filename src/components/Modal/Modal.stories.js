import React from 'react';
import { boolean, number, withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { View, Text } from 'native-base';

import { getContentDecorator } from 'storybook/index';
import Modal from './Modal';

const stories = storiesOf('Components/Modal', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

const ModalContent = () => (
  <View style={{ backgroundColor: '#FFDDDD', padding: 20 }}>
    <Text>
      The Modal component is a simple way to present content above an enclosing view.
    </Text>
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
      <View style={{ aspectRatio: 1, width: '40%', borderWidth: 1, borderColor: '#FF0000' }} />
      <View style={{ aspectRatio: 1, width: '40%', borderWidth: 1, borderColor: '#FF0000' }} />
    </View>
  </View>
);

// Stories
stories.add('Default', () => {
  const isVisible = boolean('isVisible', false);
  const height = number('Height', 400);

  return (
    <View>
      <Text>Change `isVisible` knob to show/hide the modal</Text>

      <Modal
        isVisible={isVisible}
        title="Modal title"
        height={height}
        onCancel={action('onCancel')}
        onSwipe={action('onSwipe')}
        onDismiss={action('onDismiss')}
        onDone={action('onDone')}
        onRequestClose={action('onRequestClose')}
        onShow={action('onShow')}
      >
        <ModalContent />
      </Modal>
    </View>
  );
});
