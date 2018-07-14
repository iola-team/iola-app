import React from 'react';
import { withKnobs } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { Image } from 'react-native';
import { Button, Text } from 'native-base';

import { getContentDecorator } from 'storybook';

import Item from './PhotoGridItem';
import PhotoGrid from './PhotoGrid';
import ImageProgress from '../ImageProgress';

const stories = storiesOf('Components/PhotoGrid', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

// Stories
stories.add('Empty grid with numbers', () => {
  return (
    <PhotoGrid
      renderItem={index => (
        <Item placeholder style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text>{index}</Text>
        </Item>
      )}
    />
  );
});

const imageUrl = 'http://endlesstheme.com/Endless1.5.1/img/user2.jpg';
const imagePreview = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/hAy1odHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5RUI5QkU3MTkxQjAxMUUzQUM1NkQ5MzlGODhCQjg2NCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5RUI5QkU3MjkxQjAxMUUzQUM1NkQ5MzlGODhCQjg2NCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjlFQjlCRTZGOTFCMDExRTNBQzU2RDkzOUY4OEJCODY0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjlFQjlCRTcwOTFCMDExRTNBQzU2RDkzOUY4OEJCODY0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/9sAQwAKBwcIBwYKCAgICwoKCw4YEA4NDQ4dFRYRGCMfJSQiHyIhJis3LyYpNCkhIjBBMTQ5Oz4+PiUuRElDPEg3PT47/9sAQwEKCwsODQ4cEBAcOygiKDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7/8AAEQgAHgAeAwERAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A7HFSWYmu31/EDb6YIxMAC8ki5C56AD1rGdXldjenR51c52y8X6jY6vHp+s+TNHI4Tz412lSenTgitIT5lcidPldjtiOa0MizipGYmvCKPS/tKRZaeQI8isdzLuwQMem0CuOTvJno01aCPOPEMcCa0ywOzZUuQxHy4PHT/PFb0/hOeslzaHq8DGS2ic9WRSfxFbnKT3Eogt5JWPEaFj+AzUPQpaux5rp19qWqPqVpFdzCE/vYI8/KJCfm4981yy0SZ2w1k0YtzptxbXZtmLT3c7Y4HP8A9YCtYS5jKpHl3PWrKaGS3VInDGJQrDuCB6V0I5WUvEl9JBbi2QACYbXPseMVzVpNKyOmhBN3fQzfB+lWtk9/fBd23oO+BzXNKd0dkYWOet5jd6tLcBmSWVWkLD+FScYHvxXRRRy4h9De8IE/brpsnGwADOehrq6HKz//2Q==';

stories.add('Loading first image', () => {
  return (
    <PhotoGrid
      renderItem={
        index => (index === 0) ? (
          <Item>
            <ImageProgress
              style={{ flex: 1 }}
              blurRadius={1}
              previewUrl={imagePreview}
              progress={0.3}
              onCancel={action('onCancel')}
              active
            >
              <Image source={{ uri: imageUrl }} />
            </ImageProgress>
          </Item>
        ) : null
      }
    />
  );
});


stories.add('Complex example', () => {
  const items = [];

  items.push((
    <Item>
      <Image source={{ uri: imageUrl }} style={{ flex: 1 }} />
    </Item>
  ));

  items.push((
    <Item>
      <ImageProgress
        style={{ flex: 1 }}
        blurRadius={1}
        previewUrl={imagePreview}
        progress={0.3}
        onCancel={action('onCancel')}
        active
      >
        <Image source={{ uri: imageUrl }} />
      </ImageProgress>
    </Item>
  ));

  items.push((
    <Item placeholder>
      <Button
        style={{ flex: 1 }}
        transparent
        block
      >
        <Text>Button</Text>
      </Button>
    </Item>
  ));

  return (
    <PhotoGrid renderItem={index => items[index]} />
  );
});
