import React from 'react';
import { storiesOf } from '@storybook/react-native';
import faker from 'faker';

import { getContentDecorator } from '~storybook';
import Image from './Image';

const stories = storiesOf('Components/Image', module);

// Decorators
stories.addDecorator(getContentDecorator({ centered: true }));

// Stories
stories.add('Default', () => (
  <Image style={{ width: 200, aspectRatio: 1 }} source={{ uri: faker.image.avatar() }} />
));
