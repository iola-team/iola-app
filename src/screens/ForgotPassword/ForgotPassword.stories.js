import React from 'react';
import { storiesOf } from '@storybook/react-native';

import ForgotPassword from './ForgotPassword';

const stories = storiesOf('Screens/ForgotPassword', module);
// @TODO: navigation
// Stories
stories.add('Screen', () => <ForgotPassword />);
