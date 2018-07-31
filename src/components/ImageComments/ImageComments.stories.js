import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { Button, Text } from 'native-base';

import { getContentDecorator } from 'storybook';
import ImageComments from 'components/ImageComments';

const stories = storiesOf('Components/ImageComments', module);

// Decorators
stories.addDecorator(getContentDecorator({ padder: true }));

// Stories

stories.add('Default', () => (
  <ImageComments
    onChange={action('onChange')}
    onCancel={action('onCancel')}
    onDone={action('onDone')}
    onShow={action('onShow')}
    onDismiss={action('onDismiss')}
    onRequestClose={action('onRequestClose')}
  >
    {onShowImageComments => (
      <Button onPress={onShowImageComments}>
        <Text>onShowImageComments</Text>
      </Button>
    )}
  </ImageComments>
));
