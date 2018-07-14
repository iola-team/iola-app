import React from 'react';
import { storiesOf } from '@storybook/react-native';

import EmailVerification from './EmailVerification';

const stories = storiesOf('Screens/EmailVerification', module);

// Stories
stories.add('Screen', () => <EmailVerification />);
