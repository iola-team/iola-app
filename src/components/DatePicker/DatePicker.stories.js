import React from 'react';
import { boolean, number, withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { Button, Text } from 'native-base';

import { getContentDecorator, getApolloDecorator } from 'storybook/index';
import DatePicker from './DatePicker';

const stories = storiesOf('Components/DatePicker', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

const renderChildren = (show, selectedOptions) => (
  <Button transparent onPress={show}>
    <Text>
      Pick date
    </Text>
  </Button>
);

// Stories

stories.add('Default', () => {
  const isVisible = boolean('Is visible', false);
  const minDate = new Date();
  minDate.setFullYear(1990);

  return (
    <DatePicker
      isVisible={isVisible}
      label={'Birthdate'}
      onSelect={action('onSelect')}
      onShow={action('onShow')}
      onHide={action('onHide')}
      minDate={minDate}
    >
      {renderChildren}
    </DatePicker>
  );
});
