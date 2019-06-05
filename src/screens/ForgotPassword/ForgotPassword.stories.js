import React from 'react';
import { storiesOf } from '@storybook/react-native';

import ForgotPassword from './ForgotPassword';

const stories = storiesOf('Screens/ForgotPassword', module);

// TODO: try to do it with decorator in the future: https://github.com/storybooks/storybook/issues/340
const mockedNavigation = {
  goBack: () => alert('Sign in'),
  state: {
    params: {},
  },
};

// Stories
stories.add('Screen', () => <ForgotPassword navigation={mockedNavigation} />);
