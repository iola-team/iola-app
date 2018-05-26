import React from 'react';
import { without, includes, union } from 'lodash';
import { withKnobs, boolean } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { compose, withStateHandlers } from 'recompose';
import { Button, Text } from 'native-base';

import { getContentDecorator, getApolloDecorator } from 'storybook/index';
import ListPicker from './ListPicker';

const stories = storiesOf('Components/ListPicker', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

const options = [
  { label: 'Tacos', value: 1 },
  { label: 'Kebab', value: 2 },
  { label: 'Pizza', value: 3 },
  { label: 'Pasta', value: 4 },
  { label: 'Avocados', value: 5 },
  { label: 'Tacos 2', value: 6 },
  { label: 'Kebab 2', value: 7 },
  { label: 'Pizza 2', value: 8 },
  { label: 'Pasta 2', value: 9 },
  { label: 'Avocados 2', value: 10 },
];

const Multiselect = compose(
  withStateHandlers({
    value: [],
  }, {
    onSelect: ({ value: values }) => (value) => {
      return {
        value: includes(values, value)
          ? without(values, value)
          : union(values, [value]),
      };
    },
  }),
)(ListPicker);

const Select = compose(
  withStateHandlers({
    value: [],
  }, {
    onSelect: ({ value: values }) => value => ({ value: [value] }),
  }),
)(ListPicker);

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
  const isVisible = boolean('Is visible', false);

  return (
    <ListPicker
      isVisible={isVisible}
      label={'Favourite food'}
      options={options}
      value={[3, 5]}
      onSelect={action('onSelect')}
      onShow={action('onShow')}
      onHide={action('onHide')}
    >
      {renderChildren}
    </ListPicker>
  );
});

stories.add('Multi select wrapper', () => {
  return (
    <Multiselect
      label={'Multi select'}
      invitation={'Choose multiple'}
      options={options}
    >
      {renderChildren}
    </Multiselect>
  );
});

stories.add('Single select wrapper', () => {
  return (
    <Select
      label={'Single select'}
      invitation={'Choose one'}
      options={options}
    >
      {renderChildren}
    </Select>
  );
});
