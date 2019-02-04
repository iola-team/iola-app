import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { select, text, withKnobs } from '@storybook/addon-knobs';

import { getContainerDecorator } from 'storybook';
import NoContent from './NoContent';

const stories = storiesOf('Components/NoContent', module);

// Decorators
stories.addDecorator(withKnobs());
stories.addDecorator(getContainerDecorator());

// Stories
const icons = ['photos-empty-state', 'chats-empty-state', 'comments-empty-state'];
const getIcon = () => select('Icon', icons, icons[0]);
const getText = () => text('Text', 'No Content');

stories.add('Default', () => <NoContent icon={getIcon()} text={getText()} />);
