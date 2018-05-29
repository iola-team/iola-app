import React from 'react';
import { number, withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';

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


// Stories
stories.add('Select', () => {
  return (
    <Section>
      <Input
        label={"Gender"}
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
  return (
    <Section>
      <Input
        label={"Multi-select"}
        type="select"
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
  return (
    <Section>
      <Input
        type="text"
        label={"Real name"}
        placeholder={'Enter real name'}
      />
    </Section>
  );
});

stories.add('Password', () => {
  return (
    <Section>
      <Input
        type="text"
        secure
        label={'Password'}
        placeholder={'Enter password'}
      />
    </Section>
  );
});

stories.add('Textarea', () => {
  return (
    <Section>
      <Input
        type="text"
        multiline
        label={'Textarea'}
        placeholder={'Enter text'}
      />
    </Section>
  );
});

stories.add('Switch', () => {
  return (
    <Section>
      <Input
        type="switch"
        label={'Switch'}
      />
    </Section>
  );
});

stories.add('Date', () => {
  return (
    <Section>
      <Input
        type="date"
        label={'Date'}
        placeholder={'Select date'}
      />
    </Section>
  );
});

stories.add('All', () => {
  return (
    <Section>
      <Input
        label={"Gender"}
        type="select"
        placeholder={'Select a value'}
        options={[
          { label: 'Female', value: '1' },
          { label: 'Male', value: '2' },
        ]}
      />

      <Input
        label={"Multi-select"}
        type="select"
        placeholder={'Select values'}
        options={[
          { label: 'Female', value: '1' },
          { label: 'Male', value: '2' },
        ]}
      />

      <Input
        type="text"
        label={'Real name'}
        placeholder={'Enter real name'}
      />

      <Input
        type="text"
        secure
        label={'Password'}
        placeholder={'Enter password'}
      />

      <Input
        type="text"
        multiline
        label={'Textarea'}
        placeholder={'Enter text'}
      />

      <Input
        type="date"
        label={'Date'}
        placeholder={'Select date'}
      />

      <Input
        type="switch"
        label={'Switch'}
      />
    </Section>
  );
});
