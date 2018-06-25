import React from 'react';
import { number, withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';

import { getContainerDecorator } from 'storybook/index';
import ChatFooter from './ChatFooter';

const stories = storiesOf('Components/ChatFooter', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContainerDecorator({
  style: {
    backgroundColor: '#F8F9FB',
    justifyContent: 'flex-end',
  },
}));

// Stories
stories.add('Default', () => {
  return (
    <ChatFooter />
  );
});
