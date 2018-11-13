import React from 'react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
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
  const done = boolean('Done', false);

  return (
    <View style={{ backgroundColor: '#FFFFFF' }}>
      <MessageStateIndicator done={done} />
    </View>
  );
});
