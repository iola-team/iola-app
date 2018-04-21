import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { number, boolean, withKnobs } from '@storybook/addon-knobs/react';

import { getContentDecorator } from 'storybook';
import CircularProgress from './CircularProgress';

const stories = storiesOf('Components/CircularProgress', module);

stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ centered: true }));


stories.add('Progress', () => {
  const progress = number('Progress', 0.3, {
    range: true,
    min: 0,
    max: 1,
    step: 0.01,
  });

  const isInDetermined = boolean('Unknown', false);

  return (
    <CircularProgress progress={isInDetermined ? null : progress} />
  );
});
