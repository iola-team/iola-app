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
    width: number('Width', 200),
    height: number('Height', 200),
    crop: boolean('Crop', false),
    multiple: boolean('Multiple', false),
    onChange: action('change'),
  };

  return (
    <ImagePicker {...props}>
      {({ pick, fromCamera, fromGallery }, [image], clear) => (
        <Fragment>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
            <Button onPress={pick} style={{ marginRight: 8 }}>
              <Text>Pick</Text>
            </Button>
            <Button onPress={fromGallery} style={{ marginRight: 8 }}>
              <Text>Pick from gallery</Text>
            </Button>
            <Button onPress={fromCamera} style={{ marginRight: 8 }}>
              <Text>Pick camera</Text>
            </Button>
          </View>
          <Button block warning onPress={clear} style={{ marginBottom: 20 }}>
            <Text>Clear</Text>
          </Button>

          {
            image && (
              <Image source={{ uri: image.path }} style={{ width: image.width, height: image.height, alignSelf: 'center' }} />
            )
          }
        </Fragment>
      )}
    </ImagePicker>
  );
});
