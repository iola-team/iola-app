import React from 'react';
import { number, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';

import { getContentDecorator } from '~storybook';
import TabBarIcon from './TabBarIcon';

const stories = storiesOf('Components/TabBarIcon', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ centered: true }));

// Stories
stories.add('Default', () => (
  <TabBarIcon name="chats-bar" count={number('Count', 2)} />
));
