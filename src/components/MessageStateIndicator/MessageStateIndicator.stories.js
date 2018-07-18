import React from 'react';
import { number, withKnobs } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react-native';
import { View } from 'native-base';

import { getContentDecorator } from 'storybook';
import MessageStateIndicator from './MessageStateIndicator';

const stories = storiesOf('Components/MessageStateIndicator', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true, centered: true, backgroundColor: '#CCCCCC' }));

// Stories
stories.add('Default', () => {
  return (
    <View style={{ backgroundColor: '#FFFFFF' }}>
      <MessageStateIndicator />
    </View>
  );
});
