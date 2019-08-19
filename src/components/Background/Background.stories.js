import React from 'react';
import { storiesOf } from '@storybook/react-native';

import Background from './Background';

const stories = storiesOf('Components/Background', module);

// Stories
stories.add('Default', () => <Background />);
