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

// Stories
stories.add('Default', () => {
  return (
    <PhotoEdit
      edges={[]}
    />
  );
});
