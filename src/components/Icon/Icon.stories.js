import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { select, withKnobs } from '@storybook/addon-knobs';

import { getContentDecorator } from 'storybook';
import Icon from './Icon';
import glyphMap from './glyphMap';

const stories = storiesOf('Components/Icon', module);

// Decorators
stories.addDecorator(withKnobs());
stories.addDecorator(getContentDecorator({ centered: true }));

// Stories
const icons = Object.keys(glyphMap);
const getIcon = () => select('Icon', icons, icons[0]);

stories.add('Default', () => <Icon name={getIcon()} style={{ fontSize: 300 }} />);
