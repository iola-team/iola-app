import React from 'react';
import { boolean, date, withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { compose, withStateHandlers } from 'recompose';
import { Button, Text } from 'native-base';

import { getContentDecorator } from 'storybook';
import DatePicker from './DatePicker';

const stories = storiesOf('Components/DatePicker', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

function dateKnob(name, defaultValue) {
  const stringTimestamp = date(name, defaultValue)
  return new Date(stringTimestamp)
}

const renderChildren = (show, date) => (
  <Button transparent onPress={show}>
    <Text>
      {date ? date.toString() : 'Pick date'}
    </Text>
  </Button>
);

const DatePickerWithState = compose(
  withStateHandlers({
    value: new Date('March 7, 1986 00:00:00'),
  }, {
    onChange: () => value => ({ value }),
  }),
)(DatePicker);

// Stories

stories.add('No value prop', () => {
  const minDate = dateKnob('Min date', new Date('1980'))
  const maxDate = dateKnob('Max date', new Date())

  return (
    <DatePicker
      label={'Birthdate'}
      onChange={action('onChange')}
      onCancel={action('onCancel')}
      onDone={action('onDone')}
      onShow={action('onShow')}
      onDismiss={action('onDismiss')}
      onRequestClose={action('onRequestClose')}
      minDate={minDate}
      maxDate={maxDate}
    >
      {renderChildren}
    </DatePicker>
  );
});

stories.add('Fixed value prop', () => {
  const minDate = dateKnob('Min date', new Date('1980'))
  const maxDate = dateKnob('Max date', new Date())

  return (
    <DatePicker
      value={new Date()}
      label="Birthdate"
      onChange={action('onChange')}
      onCancel={action('onCancel')}
      onDone={action('onDone')}
      onShow={action('onShow')}
      onDismiss={action('onDismiss')}
      onRequestClose={action('onRequestClose')}
      minDate={minDate}
      maxDate={maxDate}
    >
      {renderChildren}
    </DatePicker>
  );
});

stories.add('Dynamic value prop', () => {
  const minDate = dateKnob('Min date', new Date('1980'));
  const maxDate = dateKnob('Max date', new Date());

  return (
    <DatePickerWithState
      label="Birthdate"
      onChange={action('onChange')}
      onCancel={action('onCancel')}
      onDone={action('onDone')}
      onShow={action('onShow')}
      onDismiss={action('onDismiss')}
      onRequestClose={action('onRequestClose')}
      minDate={minDate}
      maxDate={maxDate}
    >
      {renderChildren}
    </DatePickerWithState>
  );
});

stories.add('Controlled with isVisible prop', () => {
  const minDate = dateKnob('Min date', new Date('1980'));
  const maxDate = dateKnob('Max date', new Date());
  const isVisible = boolean('isVisible', false);

  return (
    <DatePickerWithState
      isVisible={isVisible}
      label="Birthdate"
      onChange={action('onChange')}
      onCancel={action('onCancel')}
      onDone={action('onDone')}
      onShow={action('onShow')}
      onDismiss={action('onDismiss')}
      onRequestClose={action('onRequestClose')}
      minDate={minDate}
      maxDate={maxDate}
    >
      {renderChildren}
    </DatePickerWithState>
  );
});
