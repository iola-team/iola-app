import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { boolean, withKnobs } from '@storybook/addon-knobs';

import Launch from './Launch';

const stories = storiesOf('Screens/Launch', module);

// Decorators
stories.addDecorator(withKnobs);

// Stories
stories.add('Screen', () => {
  // @TODO: try to do it with decorator in the future: https://github.com/storybooks/storybook/issues/340
  const mockedProps = {
    data: {
      loading: boolean('Loading', true),
    },

    navigation: {
      navigate: () => alert('Mocked navigation'),
    },
  };

  return <Launch {...mockedProps} />;
});
