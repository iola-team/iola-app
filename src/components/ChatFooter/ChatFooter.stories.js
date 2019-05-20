import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';

import { getContainerDecorator } from '~storybook';
import ChatFooter from './ChatFooter';

const stories = storiesOf('Components/ChatFooter', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContainerDecorator({
  style: {
    justifyContent: 'flex-end',
  },
}));

// Stories
stories.add('Default', () => <ChatFooter onSend={action('onSend')} />);
