import React from 'react';
import { text, boolean, withKnobs, date } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';

import { getContentDecorator } from '~storybook';

import FieldSection from '../FieldSection';
import FieldView from '.';

const stories = storiesOf('Components/FieldView', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator());

function dateKnob(name, defaultValue) {
  const stringTimestamp = date(name, defaultValue);

  return new Date(stringTimestamp);
}

const Section = ({ children }) => (
  <FieldSection label="Field section">{children}</FieldSection>
);

// Stories
stories.add('Select', () => (
  <Section>
    <FieldView
      value={['1']}
      label="Select"
      type="select"
      options={[
        { label: 'Female', value: '1' },
        { label: 'Male', value: '2' },
      ]}
    />
  </Section>
));

stories.add('Multi-select', () => (
  <Section>
    <FieldView
      value={['1', '2']}
      label="Multi-select"
      type="select"
      multiple
      options={[
        { label: 'Female', value: '1' },
        { label: 'Male', value: '2' },
      ]}
    />
  </Section>
));

stories.add('Text', () => {
  const value = text('Value', 'Text value');

  return (
    <Section>
      <FieldView
        value={value}
        type="text"
        label="Real name"
      />
    </Section>
  );
});

stories.add('Password', () => {
  const value = text('Value', 'Text value');

  return (
    <Section>
      <FieldView
        value={value}
        type="text"
        secure
        label="Password"
      />
    </Section>
  );
});

stories.add('Textarea', () => {
  const value = text('Value', 'Multi-line text goes here...');

  return (
    <Section>
      <FieldView
        value={value}
        type="text"
        multiline
        label="Textarea"
      />
    </Section>
  );
});

stories.add('Switch', () => {
  const value = boolean('On', true);

  return (
    <Section>
      <FieldView
        value={value}
        type="switch"
        label="Switch"
      />
    </Section>
  );
});

stories.add('Date', () => {
  const value = dateKnob('Value', new Date());

  return (
    <Section>
      <FieldView
        value={value}
        type="date"
        label="Date"
      />
    </Section>
  );
});

stories.add('All', () => (
  <Section>
    <FieldView
      value={['1']}
      label="Select"
      type="select"
      options={[
        { label: 'Female', value: '1' },
        { label: 'Male', value: '2' },
      ]}
    />

    <FieldView
      value={['1', '2']}
      label="Multi-select"
      type="select"
      multiple
      options={[
        { label: 'Female', value: '1' },
        { label: 'Male', value: '2' },
      ]}
    />

    <FieldView
      value="Grey Rabbit"
      type="text"
      label="Real name"
    />

    <FieldView
      value="1234"
      type="text"
      secure
      label="Password"
    />

    <FieldView
      value="Multi-line text goes here..."
      type="text"
      multiline
      label="Multi-line text"
    />

    <FieldView
      value={new Date()}
      type="date"
      label="Date"
    />

    <FieldView
      value
      last
      type="switch"
      label="Switch"
    />
  </Section>
));
