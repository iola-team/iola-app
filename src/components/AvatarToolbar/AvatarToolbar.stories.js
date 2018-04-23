import React from 'react';
import { withHandlers } from 'recompose';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import {
  Text
} from 'native-base';

import { getContentDecorator } from 'storybook';
import AvatarToolbar from './AvatarToolbar';

const stories = storiesOf('Components/AvatarToolbar', module)
  .addDecorator(getContentDecorator({ padder: true }));

const avatarUrl = 'http://endlesstheme.com/Endless1.5.1/img/user2.jpg';

const Toolbar = withHandlers({
  onButtonPress: () => action('press'),
})(AvatarToolbar);

stories.add('Has avatar', () => (
  <Toolbar imageUrl={avatarUrl} />
));

stories.add('No avatar', () => (
  <Toolbar imageUrl={null} />
));
