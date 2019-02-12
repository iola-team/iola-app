import React from 'react';
import { withKnobs, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';

import { getContentDecorator } from 'storybook';
import ImageFit from './ImageFit';

const stories = storiesOf('Components/ImageFit', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

// Stories
stories.add('Broken Image', () => {
  const url = 'https://broken.image';
  const maxHeight = number('maxHeight', 300);
  const maxWidth = number('maxWidth', 300);

  return <ImageFit url={url} maxHeight={maxHeight} maxWidth={maxWidth} />;
});

stories.add('Big Image (Spinner)', () => {
  const url = 'https://upload.wikimedia.org/wikipedia/commons/6/6f/2013_09_10_Tomate.jpg';

  return <ImageFit url={url} maxHeight={300} maxWidth={300} />;
});

stories.add('Horizontal Image', () => {
  const url = 'https://ironcodestudio.com/wp-content/uploads/2015/03/css-remove-horizontal-scrollbar.jpg';

  return <ImageFit url={url} maxHeight={300} maxWidth={300} />;
});

stories.add('Vertical Image', () => {
  const url = 'https://images.unsplash.com/photo-1534142499731-a32a99935397?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1534&q=80';

  return <ImageFit url={url} maxHeight={300} maxWidth={300} />;
});
