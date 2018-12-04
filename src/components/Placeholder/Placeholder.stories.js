import React from 'react';
import { number, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';

import { getContentDecorator } from 'storybook';
import Placeholder from './Placeholder';

const stories = storiesOf('Components/Placeholder', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ centered: true }));

// Stories
stories.add('Default', () => (
  <Placeholder 
    style={{ height: 200, width: 200, backgroundColor: "#EEEEEE" }}
  />
));
