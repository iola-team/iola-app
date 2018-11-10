import React from 'react';
import { number, text, boolean, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { compose, withStateHandlers } from 'recompose';

import { getContentDecorator, getApolloDecorator } from 'storybook';
import { Card, CardItem, Text, View, Form } from 'native-base';

import Input from './index';

const stories = storiesOf('Components/Input', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator());

const Section = ({ children }) => (
  <Card transparent>
    <CardItem header padder>
      <Text>Fields section</Text>
    </CardItem>
    <CardItem cardBody highlight horizontalPadder>
      {children}
    </CardItem>
  </Card>
);

const windValue = compose(
  withStateHandlers(({ defaultValue = null }) => ({
    value: defaultValue,
  }), {
    onChange: () => value => ({ value }),
  }),
);

const StatefulInput = windValue(Input);

// Stories
stories.add('Select', () => {
  const isLoading = boolean('isLoading', false);
  const error = text('Error', undefined);

  return (
    <Section>
      <StatefulInput
        defaultValue={['1']}
        isLoading={isLoading}
        error={error}
        label={"Select"}
        type="select"
        placeholder={'Select a value'}
        options={[
          { label: 'Female', value: '1' },
          { label: 'Male', value: '2' },
        ]}
      />
    </Section>
  );
});

stories.add('Select + Error', () => {
  const isLoading = boolean('isLoading', false);
  const error = text('Error', "Error message");

  return (
    <Section>
      <StatefulInput
        defaultValue={['1']}
        isLoading={isLoading}
        error={error}
        label={"Select"}
        type="select"
        placeholder={'Select a value'}
        options={[
          { label: 'Female', value: '1' },
          { label: 'Male', value: '2' },
        ]}
      />
    </Section>
  );
});

stories.add('Multi-select', () => {
  const isLoading = boolean('isLoading', false);
  const error = text('Error', undefined);

  return (
    <Section>
      <StatefulInput
        defaultValue={['1', '2']}
        isLoading={isLoading}
        error={error}
        label={"Multi-select"}
        type="select"
        multiple
        placeholder={'Select values'}
        options={[
          { label: 'Female', value: '1' },
          { label: 'Male', value: '2' },
        ]}
      />
    </Section>
  );
});

stories.add('Text', () => {
  const isLoading = boolean('isLoading', false);
  const error = text('Error', undefined);

  return (
    <Section>
      <StatefulInput
        defaultValue={"Default value"}
        isLoading={isLoading}
        error={error}
        type="text"
        label={"Real name"}
        placeholder={'Enter real name'}
      />
    </Section>
  );
});

stories.add('Password', () => {
  const isLoading = boolean('isLoading', false);
  const error = text('Error', undefined);

  return (
    <Section>
      <StatefulInput
        defaultValue={"123"}
        isLoading={isLoading}
        error={error}
        type="text"
        secure
        label={'Password'}
        placeholder={'Enter password'}
      />
    </Section>
  );
});

stories.add('Textarea', () => {
  const isLoading = boolean('isLoading', false);
  const error = text('Error', undefined);

  return (
    <Section>
      <StatefulInput
        type="text"
        isLoading={isLoading}
        error={error}
        multiline
        label={'Textarea'}
        placeholder={'Enter text'}
      />
    </Section>
  );
});

stories.add('Switch', () => {
  const isLoading = boolean('isLoading', false);
  const error = text('Error', undefined);

  return (
    <Section>
      <StatefulInput
        defaultValue={false}
        isLoading={isLoading}
        error={error}
        type="switch"
        label={'Switch'}
      />
    </Section>
  );
});

stories.add('Date', () => {
  const isLoading = boolean('isLoading', false);
  const error = text('Error', undefined);

  return (
    <Section>
      <StatefulInput
        defaultValue={new Date('March 7, 1986 00:00:00')}
        isLoading={isLoading}
        error={error}
        type="date"
        label={'Date'}
        minDate={new Date('1980')}
        maxDate={new Date('2018')}
        placeholder={'Select date'}
      />
    </Section>
  );
});

stories.add('All', () => {
  return (
    <Section>
      <StatefulInput
        label={"Select"}
        type="select"
        placeholder={'Select a value'}
        options={[
          { label: 'Female', value: '1' },
          { label: 'Male', value: '2' },
        ]}
      />

      <StatefulInput
        label={"Multi-select"}
        type="select"
        multiple
        placeholder={'Select values'}
        options={[
          { label: 'Female', value: '1' },
          { label: 'Male', value: '2' },
        ]}
      />

      <StatefulInput
        type="text"
        label={"Real name"}
        placeholder={'Enter real name'}
      />

      <StatefulInput
        type="text"
        secure
        label={'Password'}
        placeholder={'Enter password'}
      />

      <StatefulInput
        type="text"
        multiline
        label={'Textarea'}
        placeholder={'Enter text'}
      />

      <StatefulInput
        type="date"
        label={'Date'}
        minDate={new Date('1980')}
        maxDate={new Date('2018')}
        placeholder={'Select date'}
      />

      <StatefulInput
        last
        type="switch"
        label={'Switch'}
      />
    </Section>
  );
});
