import React from 'react';
import { storiesOf } from '@storybook/react-native';

import Logo from './Logo';

const stories = storiesOf('Components/Logo', module);

// Stories
stories.add('Default', () => <Logo />);
