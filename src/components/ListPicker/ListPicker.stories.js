import React from 'react';
import { withKnobs, boolean, array } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { withStateHandlers } from 'recompose';
import { Button, Text } from 'native-base';

import { getContentDecorator } from '~storybook';
import ListPicker from './ListPicker';

const stories = storiesOf('Components/ListPicker', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

const options = [
  { label: 'Tacos', value: '1' },
  { label: 'Kebab', value: '2' },
  { label: 'Pizza', value: '3' },
  { label: 'Pasta', value: '4' },
  { label: 'Avocados', value: '5' },
  { label: 'Tacos 2', value: '6' },
  { label: 'Kebab 2', value: '7' },
  { label: 'Pizza 2', value: '8' },
  { label: 'Pasta 2', value: '9' },
  { label: 'Avocados 2', value: '10' },
];

const Select = withStateHandlers({
  value: [],
}, {
  onChange: () => value => {
    action('onChange', value);

    return { value };
  },
})(ListPicker);

const renderChildren = (show, selectedOptions) => (
  <Button transparent onPress={show}>
    <Text>
      {
        selectedOptions.length
          ? selectedOptions.map(option => option.label).join(', ')
          : 'Select items'
      }
    </Text>
  </Button>
);

// Stories
stories.add('Static', () => {
  const value = array('Selected', ['2', '5']);

  return (
    <ListPicker
      label="Favourite food"
      options={options}
      value={value}
      onChange={action('onChange')}
      onCancel={action('onCancel')}
      onDone={action('onDone')}
      onShow={action('onShow')}
      onDismiss={action('onDismiss')}
      onRequestClose={action('onRequestClose')}
    >
      {renderChildren}
    </ListPicker>
  );
});

stories.add('Multi select wrapper', () => (
  <Select
    label="Multi select"
    invitation="Choose multiple"
    options={options}
    onCancel={action('onCancel')}
    onDone={action('onDone')}
    onShow={action('onShow')}
    onDismiss={action('onDismiss')}
    onRequestClose={action('onRequestClose')}
    multiple
  >
    {renderChildren}
  </Select>
));

stories.add('Single select wrapper', () => (
  <Select
    label="Single select"
    invitation="Choose one"
    options={options}
    onCancel={action('onCancel')}
    onDone={action('onDone')}
    onShow={action('onShow')}
    onDismiss={action('onDismiss')}
    onRequestClose={action('onRequestClose')}
  >
    {renderChildren}
  </Select>
));

stories.add('Controlled by isVisible prop', () => {
  const value = array('Selected', ['2', '5']);
  const isVisible = boolean('isVisible', false);

  return (
    <ListPicker
      multiple
      value={value}
      isVisible={isVisible}
      label="Single select"
      invitation="Choose one"
      options={options}
      onCancel={action('onCancel')}
      onDone={action('onDone')}
      onShow={action('onShow')}
      onDismiss={action('onDismiss')}
      onRequestClose={action('onRequestClose')}
    >
      {renderChildren}
    </ListPicker>
  );
});
