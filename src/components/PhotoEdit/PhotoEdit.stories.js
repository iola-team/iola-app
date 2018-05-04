import React from 'react';
import { withHandlers } from 'recompose';
import { number, withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';

import { getContentDecorator } from 'storybook/index';
import PhotoEdit from './PhotoEdit';

const stories = storiesOf('Components/PhotoEdit', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

const edges = [
  {
    cursor: 'cursor:1',
    node: {
      id: 'Photo:1',
      url: 'https://images.unsplash.com/photo-1523444540064-c7c832de3364?w=400&h400',
    }
  },

  {
    cursor: 'cursor:2',
    node: {
      id: 'Photo:2',
      url: 'https://images.unsplash.com/photo-1525025500848-f00b7d362dec?w=300&h=600',
    }
  },

  {
    cursor: 'cursor:3',
    node: {
      id: 'Photo:3',
      url: 'https://images.unsplash.com/photo-1524850108227-6f2c213bf20d?w=800&h=600',
    }
  },
];

const withPhotos = {
  photos: {
    edges,
  }
};

const empty = {
  photos: {
    edges: [],
  }
};

// Stories
stories.add('With photos', () => {
  return (
    <PhotoEdit user={withPhotos} />
  );
});

stories.add('Empty', () => {
  return (
    <PhotoEdit user={empty} />
  );
});
