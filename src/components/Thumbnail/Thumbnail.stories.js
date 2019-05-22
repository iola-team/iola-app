import React from 'react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import faker from 'faker';
import { storiesOf } from '@storybook/react-native';

import { getContentDecorator } from '~storybook';
import Thumbnail from './Thumbnail';

const stories = storiesOf('Components/Thumbnail', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ centered: true }));

// Stories
stories.add('Default', () => (
  <Thumbnail
    source={{ uri: faker.image.avatar() }}
    large={boolean('large', false)}
    small={boolean('small', false)}
  />
));
