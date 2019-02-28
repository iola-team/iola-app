import React from 'react';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { Text } from 'native-base';

import { getContentDecorator } from '~storybook';
import Overlay from './Overlay';

const stories = storiesOf('Components/Overlay', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

// Stories
const style = {
  justifyContent: 'center',
  alignItems: 'center',
};

stories.add('Default', () => (
  <Overlay
    style={style}
    visible={boolean('Is visible', false)}
    onRequestClose={action('onRequestClose')}
  >
    <Text>Overlay content</Text>
  </Overlay>
));
