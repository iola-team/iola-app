import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react-native';
import { Image } from 'react-native';
import { Button, Text, View } from 'native-base';
import { number, boolean, withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';

import { getContentDecorator } from 'storybook';
import ImagePicker from './ImagePicker';

const stories = storiesOf('Components/ImagePicker', module);
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

stories.add('Picker', () => {

  const props = {
    width: number('Width', 500),
    height: number('Height', 500),
    crop: boolean('Crop', false),
    multiple: boolean('Multiple', false),
    onChange: action('change'),
  };

  return (
    <ImagePicker {...props}>
      {(pick, [image], clear) => (
        <Fragment>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
            <Button onPress={pick} style={{ marginRight: 8 }}>
              <Text>Pick from gallery</Text>
            </Button>
            <Button onPress={pick} style={{ marginRight: 8 }}>
              <Text>Pick camera</Text>
            </Button>
            <Button warning onPress={clear}>
              <Text>Clear</Text>
            </Button>
          </View>
          {
            image && (
              <Image source={{ uri: image.path }} style={{ width: 300, height: 300, alignSelf: 'center' }} />
            )
          }
        </Fragment>
      )}
    </ImagePicker>
  );
});
