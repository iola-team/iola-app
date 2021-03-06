import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';

import { getContentDecorator } from '~storybook';
import SettingList from './SettingList';

const stories = storiesOf('Components/SettingList', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator());

// Stories
stories.add('Default', () => <SettingList navigation={mockedNavigation} />);
