import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { number, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';

import { getContentDecorator } from 'storybook';
import SettingList from './SettingList';

const stories = storiesOf('Components/SettingList', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

// Stories
stories.add('Default', () => <SettingList />);
