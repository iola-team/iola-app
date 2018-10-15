import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { number, boolean, withKnobs } from '@storybook/addon-knobs/react';
import { Text } from 'native-base';

import { getContentDecorator } from 'storybook';
import CircularProgress from './CircularProgress';

const stories = storiesOf('Components/CircularProgress', module);

stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ centered: true, backgroundColor: '#AAAAAA' }));

const getProgress = () => number('Progress', 0.3, {
  range: true,
  min: 0,
  max: 1,
  step: 0.01,
});

stories.add('No content', () => (
  <CircularProgress progress={getProgress()} />
));

stories.add('With content', () => {
  const progress = getProgress();

  return (
    <CircularProgress progress={progress}>
      <Text style={{ color: '#FFFFFF' }}>{Math.round(progress * 100, 0)}%</Text>
    </CircularProgress>
  );
});
