import React from 'react';
import { number, boolean, color, withKnobs } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react-native';
import { View, Text } from 'native-base';

import { getContentDecorator } from 'storybook';
import Shadow from './Shadow';

const stories = storiesOf('Components/Shadow', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ centered: true, backgroundColor: '#F8F9FB' }));

const Content = (props) => (
  <View padder style={{ backgroundColor: '#FFFFFF' }} {...props}>
    <Text>
      Each object specifies the property that will be transformed as the key, and the value to use in the transformation.
    </Text>
  </View>
);

// Stories
stories.add('Default', () => {
  const inset = boolean('inset', false);
  const top = boolean('Top', true);
  const bottom = boolean('Bottom', true);

  return (
    <Shadow top={top} bottom={bottom} inset={inset}>
      <Content />
    </Shadow>
  );
});


stories.add('Custom', () => {
  const inset = boolean('inset', false);
  const top = boolean('Top', true);
  const bottom = boolean('Bottom', true);
  const spread = number('Spread', 100);
  const fromColor = color('From color', 'rgba(65, 117, 5, 0.1)');
  const toColor = color('To color', 'rgba(65, 117, 5, 0)');

  return (
    <Shadow
      top={top}
      bottom={bottom}
      inset={inset}
      style={{
        shadowSpread: spread,
        shadowColors: [fromColor, toColor],
      }}
    >
      <Content />
    </Shadow>
  );
});

stories.add('Line', () => {
  const top = boolean('Top', true);
  const bottom = boolean('Bottom', false);
  const spread = number('Spread', 100);
  const fromColor = color('From color', 'rgba(65, 117, 5, 0.1)');
  const toColor = color('To color', 'rgba(65, 117, 5, 0)');

  return (
    <Shadow
      top={top}
      bottom={bottom}
      style={{
        width: '100%',
        shadowSpread: spread,
        shadowColors: [fromColor, toColor],
      }}
    />
  );
});
