import React from 'react';
import { withHandlers } from 'recompose';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';

import { getContentDecorator } from '~storybook';
import AvatarInput from './AvatarInput';

const stories = storiesOf('Components/AvatarInput', module).addDecorator(getContentDecorator({ padder: true }));
const avatarUrl = 'http://endlesstheme.com/Endless1.5.1/img/user2.jpg';

const Input = withHandlers({
  onChange: () => action('change'),
})(AvatarInput);

stories.add('With default value', () => (
  <Input defaultValue={avatarUrl} />
));

stories.add('No default value', () => (
  <Input defaultValue={null} />
));

stories.add('With explicit value', () => (
  <Input value={avatarUrl} />
));

stories.add('With explicit null value', () => (
  <Input value={null} />
));

stories.add('Loading', () => (
  <Input loading />
));
