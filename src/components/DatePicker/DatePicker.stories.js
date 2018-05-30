import React from 'react';
import { boolean, number, withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { compose, withStateHandlers } from 'recompose';
import { Button, Text } from 'native-base';

import { getContentDecorator, getApolloDecorator } from 'storybook/index';
import DatePicker from './DatePicker';

const stories = storiesOf('Components/DatePicker', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

const renderChildren = (show, date) => (
  <Button transparent onPress={show}>
    <Text>
      {
        date ? date.toString() : 'Pick date'
      }
    </Text>
  </Button>
);

const DatePickerWithState = compose(
  withStateHandlers({
    value: new Date('March 7, 1986 00:00:00'),
  }, {
    onSelect: () => value => ({ value }),
  }),
)(DatePicker);

// Stories

stories.add('No value prop', () => {
  const isVisible = boolean('Is visible', false);
  const minDate = new Date();
  minDate.setFullYear(1990);

  return (
    <DatePicker
      isVisible={isVisible}
      label={'Birthdate'}
      onChange={action('onChange')}
      onCancel={action('onCancel')}
      onDone={action('onDone')}
      onShow={action('onShow')}
      onHide={action('onHide')}
      minDate={minDate}
    >
      {renderChildren}
    </DatePicker>
  );
});

stories.add('Fixed value prop', () => {
  const isVisible = boolean('Is visible', false);
  const minDate = new Date();
  minDate.setFullYear(1990);

  return (
    <DatePicker
      value={new Date()}
      isVisible={isVisible}
      label={'Birthdate'}
      onChange={action('onChange')}
      onCancel={action('onCancel')}
      onDone={action('onDone')}
      onShow={action('onShow')}
      onHide={action('onHide')}
      minDate={minDate}
    >
      {renderChildren}
    </DatePicker>
  );
});

stories.add('Dynamic value prop', () => {
  const isVisible = boolean('Is visible', false);
  const minDate = new Date();
  minDate.setFullYear(1990);

  return (
    <DatePickerWithState
      isVisible={isVisible}
      label={'Birthdate'}
      onChange={action('onChange')}
      onCancel={action('onCancel')}
      onDone={action('onDone')}
      onShow={action('onShow')}
      onHide={action('onHide')}
      minDate={minDate}
    >
      {renderChildren}
    </DatePickerWithState>
  );
});
