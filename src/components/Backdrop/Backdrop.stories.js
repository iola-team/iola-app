import React from 'react';
import { button, boolean, number, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import { withStateHandlers, toRenderProps } from 'recompose';
import { View, Text } from 'native-base';

import { getContentDecorator } from '~storybook';
import Backdrop from './Backdrop';
import TouchableOpacity from '../TouchableOpacity';

const stories = storiesOf('Components/Backdrop', module);

// Decorators
stories.addDecorator(withKnobs);
stories.addDecorator(getContentDecorator({ padder: true }));

const Content = () => (
  <View style={{ backgroundColor: '#FFDDDD', padding: 20 }}>
    <Text>
      The Backdrop component is a simple way to present content above an enclosing view.
    </Text>

    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
      <View style={{ aspectRatio: 1, width: '40%', borderWidth: 1, borderColor: '#FF0000' }} />
      <View style={{ aspectRatio: 1, width: '40%', borderWidth: 1, borderColor: '#FF0000' }} />
    </View>
  </View>
);


// Stories
const WithState = toRenderProps(withStateHandlers({
  isVisible: false,
}, {
  setVisible: state => (isVisible) => ({ ...state, isVisible }),
}));
const withState = body => () => <WithState>{body}</WithState>;

stories.add('Default', () => {
  const isVisible = boolean('isVisible', false);
  const height = number('Height', 400);

  return (
    <View>
      <Text>Change `isVisible` knob to show/hide backdrop</Text>

      <Backdrop
        isVisible={isVisible}
        title="Backdrop title"
        height={height}
        onSwipe={action('onSwipe')}
        onDismiss={action('onDismiss')}
        onRequestClose={action('onRequestClose')}
        onShow={action('onShow')}
      >
        <Content />
      </Backdrop>
    </View>
  );
});

stories.add('Dismiss on swipe', withState(({ isVisible, setVisible }) => {
  const height = number('Height', 400);
  const hide = () => setVisible(false);
  button('Show', () => setVisible(true));
  button('Hide', hide);

  return (
    <View>
      <Text>Press `show/hide` knobs to show/hide backdrop</Text>

      <Backdrop
        isVisible={isVisible}
        title="Backdrop title"
        height={height}
        onSwipe={hide}
        onDismiss={action('onDismiss')}
        onRequestClose={action('onRequestClose')}
        onShow={action('onShow')}
      >
        <Content />
      </Backdrop>
    </View>
  );
}));

stories.add('Right and left buttons', withState(({ isVisible, setVisible }) => {
  const height = number('Height', 400);
  const hide = () => setVisible(false);
  button('Show', () => setVisible(true));
  button('Hide', hide);

  return (
    <View>
      <Text>Press `show/hide` knobs to show/hide backdrop</Text>

      <Backdrop
        isVisible={isVisible}
        title="Backdrop title"
        height={height}
        onSwipe={hide}
        onDismiss={action('onDismiss')}
        onRequestClose={action('onRequestClose')}
        onShow={action('onShow')}

        headerLeft={(
          <TouchableOpacity cancel onPress={hide}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        )}

        headerRight={(
          <TouchableOpacity onPress={hide}>
            <Text>Done</Text>
          </TouchableOpacity>
        )}
      >
        <Content />
      </Backdrop>
    </View>
  );
}));
