import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';

import { getContentDecorator } from '~storybook';
import SearchBar from './SearchBar';

const stories = storiesOf('Components/SearchBar', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true, backgroundColor: '#FFFFFF' }));

stories.add('Default', () => (
  <SearchBar
    value={text('Value', '')}
    placeholder={text('Placeholder', 'Search users')}
    searching={boolean('Searching', false)}
  />
));
