import React from 'react';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { compose, withStateHandlers } from 'recompose';
import { Button, Text } from 'native-base';

import { getContentDecorator } from 'storybook';
import TextPicker from './TextPicker';

const stories = storiesOf('Components/TextPicker', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

const StatefulText = compose(
  withStateHandlers({
    value: '',
  }, {
    onChange: () => value => ({ value }),
  }),
)(TextPicker);

const renderChildren = (show, value) => (
  <Button transparent onPress={show}>
    <Text>
      {value || 'Enter text'}
    </Text>
  </Button>
);

// Stories
stories.add('Static', () => {
  const value = text('Text');

  return (
    <TextPicker
      label="Description"
      value={value}
      placeholder="Enter text here"
      onChange={action('onChange')}
      onCancel={action('onCancel')}
      onDone={action('onDone')}
      onShow={action('onShow')}
      onHide={action('onHide')}
    >
      {renderChildren}
    </TextPicker>
  );
});

stories.add('Dynamic value', () => {
  return (
    <StatefulText
      label="Description"
      placeholder="Enter text here"
      onChange={action('onChange')}
      onCancel={action('onCancel')}
      onDone={action('onDone')}
      onShow={action('onShow')}
      onHide={action('onHide')}
    >
      {renderChildren}
    </StatefulText>
  );
});

stories.add('Controlled by isVisible prop', () => {
  const isVisible = boolean('isVisible', false);

  return (
    <StatefulText
      isVisible={isVisible}
      label="Description"
      placeholder="Enter text here"
      onChange={action('onChange')}
      onCancel={action('onCancel')}
      onDone={action('onDone')}
      onShow={action('onShow')}
      onHide={action('onHide')}
    >
      {renderChildren}
    </StatefulText>
  );
});
