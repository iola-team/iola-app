import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { select, text, withKnobs } from '@storybook/addon-knobs';

import { getContainerDecorator } from 'storybook';
import NoContnet from './NoContnet';

const stories = storiesOf('Components/NoContnet', module);

// Decorators
stories.addDecorator(withKnobs());
stories.addDecorator(getContainerDecorator());

// Stories
const getIcon = () => select('Icon', ['images', 'people', 'chatbubbles'], 'images');
const getText = () => text('Text', 'No content');

stories.add('Default', () => <NoContnet icon={getIcon()} text={getText()} />);
