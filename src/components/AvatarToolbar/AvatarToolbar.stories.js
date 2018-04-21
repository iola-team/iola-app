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

const hasAvatar = {
  id: 'User:1',
  avatar: {
    id: 'Avatar:1',
    url: 'http://endlesstheme.com/Endless1.5.1/img/user2.jpg',
  }
};

const noAvatar = {
  ...hasAvatar,
  avatar: null,
};

const Toolbar = withHandlers({
  onButtonPress: () => action('press'),
})(AvatarToolbar);

stories.add('Has avatar', () => (
  <Toolbar user={hasAvatar} />
));

stories.add('No avatar', () => (
  <Toolbar user={noAvatar} />
));
