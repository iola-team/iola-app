import React from 'react';
import { storiesOf } from '@storybook/react-native';
import {
  Text,
  Button,
  View,
} from 'native-base';

import { getContentDecorator } from 'storybook';

const buttons = [
  {
    path: 'Buttons/Primary',
    props: { primary: true }
  },

  {
    path: 'Buttons/Secondary',
    props: { secondary: true }
  },

  {
    path: 'Buttons/Light',
    props: { light: true }
  },
];

buttons.forEach(({ path, props: globalProps }) => {
  const stories = storiesOf(path, module).addDecorator(getContentDecorator({ padder: true }));

  [
    ['Default', {}],
    ['Transparent', { transparent: true }],
    ['Bordered', { bordered: true }],
    ['Block', { block: true }],
    ['Full', { full: true }],
  ].forEach(([ label, props ]) => {
    stories.add(label, () => (
      <Button {...{...props, ...globalProps}}>
        <Text>
          {label}
        </Text>
      </Button>
    ));
  });
});
