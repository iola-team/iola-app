import React, { Fragment } from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { range } from 'lodash';

import { getContentDecorator } from '~storybook';
import Placeholder from './Placeholder';

const stories = storiesOf('Components/Placeholder', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

// Stories
stories.add('Default', () => (
  <Placeholder
    style={{ height: 200, width: 200, backgroundColor: "#EEEEEE" }}
  />
));

stories.add('Multiple Vertical', () => (
  <View style={{ flex: 1 }}>
    {range(10).map((index) => (
      <Placeholder
        key={index}
        style={{ alignSelf: 'stretch', height: 30, marginBottom: 15, backgroundColor: "#EEEEEE" }}
      />
    ))}
  </View>
));

stories.add('Multiple Horizontal', () => (
  <View style={{ flex: 1, flexDirection: 'row' }}>
    {range(3).map((index) => (
      <Placeholder
        key={index}
        style={{ flex: 1, height: 30, marginRight: 10, backgroundColor: "#EEEEEE" }}
      />
    ))}
  </View>
));
