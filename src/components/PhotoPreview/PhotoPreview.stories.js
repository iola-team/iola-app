import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { withKnobs } from '@storybook/addon-knobs/react';

import { getContentDecorator } from 'storybook';
import PhotoPreview from './PhotoPreview';
import UserPhotosCard from '../UserPhotosCard';

const stories = storiesOf('Components/PhotoPreview', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

const user = {
  photos: {
    edges: [
      {
        node: {
          id: 1,
          url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfrqJXBM6PnW_YkX2KtwZyibjgSDpfUDX42xX5jxM96ZuoCrFb',
        },
      },
      {
        node: {
          id: 2,
          url: 'https://cdn-images-1.medium.com/max/800/1*qh2fULr7LbjXDzuAUsH9hQ.jpeg',
        },
      },
      {
        node: {
          id: 3,
          url: 'https://miro.medium.com/fit/c/240/240/1*OoW2mGH5GeA8VutCDWT27g.jpeg',
        },
      },
    ],
  }
};

stories.add('Render props', () => (
  <PhotoPreview
    images={[
      { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfrqJXBM6PnW_YkX2KtwZyibjgSDpfUDX42xX5jxM96ZuoCrFb' },
      { url: 'https://cdn-images-1.medium.com/max/800/1*qh2fULr7LbjXDzuAUsH9hQ.jpeg' },
      { url: 'https://miro.medium.com/fit/c/240/240/1*OoW2mGH5GeA8VutCDWT27g.jpeg' },
    ]}
  >
    {render => <UserPhotosCard user={user} onPress={index => render({ index })} />}
  </PhotoPreview>
));
