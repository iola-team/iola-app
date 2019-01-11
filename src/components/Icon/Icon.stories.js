import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { Text, View } from 'react-native';

import { getContentDecorator } from 'storybook';
import Icon from './Icon';
import glyphMap from './glyphMap';

const stories = storiesOf('Components/Icon', module);

// Decorators
stories.addDecorator(getContentDecorator({ padder: true }));

// Stories
stories.add('All icons', () => (
  <View>
    {Object.keys(glyphMap).map(name => (
      <View key={name} style={{ flexDirection: 'row', padding: 5 }}>
        <View style={{ width: 40 }}>
          <Icon name={name} style={{ fontSize: 20 }} />
        </View>
        <Text>{name}</Text>
      </View>
    ))}
  </View>
));
