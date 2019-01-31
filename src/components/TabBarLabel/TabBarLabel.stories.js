import React from 'react';
import { number, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';

import { getContentDecorator } from 'storybook';
import TabBarLabel from './TabBarLabel';

const stories = storiesOf('Components/TabBarLabel', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ centered: true }));

// Stories
stories.add('Default', () => (
  <TabBarLabel
    label={text('Label', 'Label')}
    count={number('Count', 10)}
    activeCount={number('Active count', 3)}
  />
));
