import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';

import { getContainerDecorator } from '~storybook';
import ChatFooter from './ChatFooter';
import KeyboardAvoidingView from '../KeyboardAvoidingView';

const stories = storiesOf('Components/ChatFooter', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContainerDecorator());

// Stories
stories.add('Default', () => (
  <KeyboardAvoidingView style={{ justifyContent: 'flex-end' }}>
    <ChatFooter onSend={action('onSend')} />
  </KeyboardAvoidingView>
));
