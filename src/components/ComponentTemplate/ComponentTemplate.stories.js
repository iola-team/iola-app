import React from 'react';
import { withHandlers } from 'recompose';
import { number, withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';

import { getContentDecorator } from 'storybook/index';
import ComponentTemplate from './ComponentTemplate';

const stories = storiesOf('Components/ComponentTemplate', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

// Mock data
const user = {
  id: 123,
};

// Stories
stories.add('Default', () => {
  const something = number('Some number', 0);

  return (
    <ComponentTemplate
      user={user}
      something={something}
      onSomething={action('onSomething')}
    />
  );
});
