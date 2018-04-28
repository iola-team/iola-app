import React, { Component } from 'react';
import { withHandlers } from 'recompose';
import { number, boolean, withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { Image } from 'react-native';
import { Button, View, Text } from 'native-base';

import { getContentDecorator } from 'storybook/index';
import ImageProgress from './ImageProgress';

const stories = storiesOf('Components/ImageProgress', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

const getProgress = () => number('Progress', 0.3, {
  range: true,
  min: 0,
  max: 1,
  step: 0.01,
})

const imageUrl = 'http://endlesstheme.com/Endless1.5.1/img/user2.jpg';
const imageStyles = {
  width: 150,
  height: 150,
};

const progressStyle = {
  alignSelf: 'flex-start',
};

// Stories
stories.add('Default', () => {
  const progress = getProgress();
  const active = boolean('Active', true);

  return (
    <ImageProgress
      previewUrl={imageUrl}
      active={active}
      progress={progress}
      style={progressStyle}
      onCancel={action('onCancel')}
    >
      <Image style={imageStyles} source={{ uri: imageUrl }} />
    </ImageProgress>
  );
});
