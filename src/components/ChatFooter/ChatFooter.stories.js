import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';

import { getContainerDecorator } from '~storybook';
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
stories.add('Default', () => <ChatFooter />);
