import React from 'react';
import { Image, View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import moment from 'moment';
import faker from 'faker';
import { sampleSize } from 'lodash';
import { withKnobs } from '@storybook/addon-knobs/react';

import { getContentDecorator } from 'storybook';
import TouchableOpacity from 'components/TouchableOpacity';
import ImageComments from 'components/ImageComments';
import ImageView from './ImageView';

const stories = storiesOf('Components/ImageView', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

// Stories
stories.add('Default', () => {
  const data = (() => {
    const photos = ['https://newbor.by/upload/iblock/dbf/dom_1.jpg', 'https://newbor.by/upload/resize_cache/iblock/ded/1024_768_040cd750bba9870f18aada2478b24840a/dom_2.jpg', 'https://newbor.by/upload/iblock/5dd/dom_3.jpg', 'https://newbor.by/upload/iblock/759/dom_4.jpg', 'https://newbor.by/upload/resize_cache/iblock/995/1024_768_040cd750bba9870f18aada2478b24840a/dom_5.jpg', 'https://newbor.by/upload/resize_cache/iblock/d5c/1024_768_040cd750bba9870f18aada2478b24840a/dom_8.14.jpg', 'https://newbor.by/upload/resize_cache/iblock/1a9/1024_768_040cd750bba9870f18aada2478b24840a/dom_11.jpg', 'https://newbor.by/upload/iblock/13f/dom_8.jpg', 'https://newbor.by/upload/resize_cache/iblock/5d7/1024_768_040cd750bba9870f18aada2478b24840a/dom_10.jpg', 'https://newbor.by/upload/iblock/0f1/dom_13.jpg', 'https://newbor.by/upload/iblock/52d/6.6-min.jpg', 'https://newbor.by/upload/iblock/42d/6.3.jpg', 'https://newbor.by/upload/iblock/861/6.6.jpg', 'https://newbor.by/upload/iblock/7f2/detskiy-sad-7.jpg', 'https://newbor.by/upload/resize_cache/iblock/953/1024_768_040cd750bba9870f18aada2478b24840a/detskiy-sad-8.jpg', 'https://newbor.by/upload/iblock/55a/detskiy-sad-6.jpg', 'https://newbor.by/upload/iblock/951/detskiy-sad-1.jpg', 'https://newbor.by/upload/resize_cache/iblock/870/1024_768_040cd750bba9870f18aada2478b24840a/detskiy-sad-9.jpg', 'https://newbor.by/upload/resize_cache/iblock/0ff/1024_768_040cd750bba9870f18aada2478b24840a/fontan-v-novoy-borovoy-_-obshchiy-plan-_2.jpg', 'https://newbor.by/upload/resize_cache/iblock/3f5/1024_768_040cd750bba9870f18aada2478b24840a/detskiy-sad-kedrovogo-kvartala.jpg', 'https://newbor.by/upload/resize_cache/iblock/421/1024_768_040cd750bba9870f18aada2478b24840a/obshchestvennye-prostranstva.jpg', 'https://newbor.by/upload/resize_cache/iblock/7b0/1024_768_040cd750bba9870f18aada2478b24840a/veloboksy-vo-dvorakh-novoy-borovoy.jpg', 'https://newbor.by/upload/iblock/549/dji_0234.jpg', 'https://newbor.by/upload/iblock/8b6/dji_0286.jpg', 'https://newbor.by/upload/iblock/595/shkola_2.png', 'https://newbor.by/upload/iblock/6a8/shkola_1.png', 'https://newbor.by/upload/iblock/9cd/shkola_4.png', 'https://newbor.by/upload/iblock/cff/shkola_5.png', 'https://newbor.by/upload/iblock/689/shkola_6.png', 'https://newbor.by/upload/iblock/d34/shkola_7.png', 'https://newbor.by/upload/resize_cache/iblock/6b8/1024_768_040cd750bba9870f18aada2478b24840a/shkola_01.png', 'https://newbor.by/upload/iblock/b25/shkola_3-_2_.png', 'https://newbor.by/upload/resize_cache/iblock/a80/1024_768_040cd750bba9870f18aada2478b24840a/shkola_0.png', 'https://newbor.by/upload/iblock/cfe/shkola_8.png', 'https://newbor.by/upload/resize_cache/iblock/70e/1024_768_040cd750bba9870f18aada2478b24840a/vezd-v-novuyu-borovuyu.jpg'];
    const getRandomDate = () => (
      moment(faker.date.between(moment().subtract(3, 'hours').format(), moment())).format()
    );

    return {
      user: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        isOnline: faker.random.boolean(),
      },
      photos: photos.map((url, id) => ({
        id,
        url,
        caption: faker.lorem[sampleSize(['words', 'sentence', 'paragraph'], 1)](),
        createdAt: getRandomDate(),
        totalCountLikes: faker.random.number({ min: 0, max: 20 }),
        totalCountComments: faker.random.number({ min: 0, max: 5 }),
      })),
    };
  })();
  const styles = {
    view: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    image: {
      width: 100,
      height: 100,
      marginRight: 8,
      marginBottom: 8,
      borderRadius: 8,
    },
  };

  return (
    <ImageComments
      onChange={action('onChange')}
      onCancel={action('onCancel')}
      onDone={action('onDone')}
      onShow={action('onShow')}
      onDismiss={action('onDismiss')}
      onRequestClose={action('onRequestClose')}
    >
      {onShowImageComments => (
        <ImageView
          images={data.photos.map(photo => ({ user: data.user, ...photo }))}
          onShowComments={onShowImageComments}
        >
          {onShowImage => (
            <View style={styles.view}>
              {data.photos.map(({ id, url }, index) => (
                <TouchableOpacity key={id} onPress={() => onShowImage(index)}>
                  <Image source={{ uri: url }} style={styles.image} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ImageView>
      )}
    </ImageComments>
  );
});
