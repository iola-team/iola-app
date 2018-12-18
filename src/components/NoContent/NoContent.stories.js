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
const getIcon = () => select('Icon', ['images', 'people', 'chatbubbles'], 'images');
const getText = () => text('Text', 'No content');

stories.add('Default', () => <NoContent icon={getIcon()} text={getText()} />);
