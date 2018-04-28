import React from 'react';
import { withHandlers } from 'recompose';
import { number, withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { Image } from 'react-native';

import { getContentDecorator } from 'storybook/index';
import ImageProgress from './ImageProgress';

const stories = storiesOf('Components/ImageProgress', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

const imageUrl = 'http://endlesstheme.com/Endless1.5.1/img/user2.jpg';
const imageStyles = {
  width: 150,
  height: 150,
};

// Stories
stories.add('Default', () => {
  const something = number('Some number', 0);

  return (
    <ImageProgress progress={0.5}>
      <Image style={imageStyles} source={{ uri: imageUrl }} />
    </ImageProgress>
  );
});
